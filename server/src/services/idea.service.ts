import { CreateIdeaDto, UpdateIdeaDto } from '@/dtos/idea/create-idea.dto'
import DeadlineModel, { IDeadline } from '@/models/deadline.model'
import { FilterQuery, Model, UpdateQuery } from 'mongoose'
import InviteModel, { IInvite } from '@/models/invite.model'
import ProjectModel, { IProject } from '@/models/project.model'
import UserModel, { IUser } from '@/models/user.model'
import FieldModel, { IField } from '@/models/field.model'
import MajorModel, { IMajor } from '@/models/major.model'
import { EmailQueue } from '@/queues/email.queue'
import { HttpException } from '@/shared/exceptions/http.exception'
import { MailService } from './mail.service'
import { PROJECT_STATUS } from '@/constants/status'
import { USER_STATUS } from '@/constants/status'
import { format } from 'date-fns'
import mongoose from 'mongoose'
import { runTransaction } from '@/helpers/transaction-helper'

export class IdeaService {
  private readonly projectModel: Model<IProject>
  private readonly userModel: Model<IUser>
  private readonly emailQueue: EmailQueue
  private readonly mailService: MailService
  private readonly deadlineModel: Model<IDeadline>
  private readonly inviteModel: Model<IInvite>
  private readonly fieldModel: Model<IField>
  private readonly majorModel: Model<IMajor>
  constructor() {
    this.projectModel = ProjectModel
    this.userModel = UserModel
    this.mailService = new MailService()
    this.emailQueue = new EmailQueue(this.mailService)
    this.deadlineModel = DeadlineModel
    this.inviteModel = InviteModel
    this.fieldModel = FieldModel
    this.majorModel = MajorModel
  }

  async createIdea(ideaData: CreateIdeaDto): Promise<IProject> {
    const getDeadline = await this.deadlineModel.findOne({ deadline_key: 'create_idea' })
    if (!getDeadline || !getDeadline.deadline_date) {
      throw new HttpException('Deadline create idea configuration is missing', 500)
    }
    if (new Date() > new Date(getDeadline.deadline_date)) {
      throw new HttpException('The deadline for creating ideas has passed', 400)
    }
    const requiredFields: (keyof CreateIdeaDto)[] = ['name', 'campus', 'leader', 'members', 'field', 'major']
    const missingFields = requiredFields.filter((field) => !ideaData[field])

    if (missingFields.length > 0) {
      throw new HttpException(`${missingFields.join(', ')} are required`, 400)
    }
    if (typeof ideaData.leader !== 'string' || !mongoose.Types.ObjectId.isValid(ideaData.leader)) {
      throw new HttpException('Invalid leader ID', 400)
    }
    const user = await this.userModel.findById(ideaData.leader)
    if (!user) {
      throw new HttpException('Leader not found', 404)
    }
    if (!user?.roles?.includes('student')) {
      throw new HttpException('This action is only available for students', 403)
    }
    const existingIdea = await this.projectModel.findOne({
      $or: [{ members: { $in: [ideaData.leader] } }, { leader: ideaData.leader }]
    })
    if (existingIdea) {
      throw new HttpException(
        'You are already part of an existing idea. Please leave it before creating a new one.',
        400
      )
    }

    // Lấy danh sách field từ database
    const fields = (await this.fieldModel.find({ _id: { $in: ideaData.field } })) as IField[]

    // Lấy tất cả major liên quan: từ ideaData.major và từ field.major
    const allMajorIds = [...new Set([...ideaData.major, ...fields.map((field) => String(field.major))])]

    // Lấy danh sách major từ database để tra cứu tên
    const majors = (await this.majorModel.find({ _id: { $in: allMajorIds } })) as IMajor[]
    const majorMap = new Map(majors.map((m) => [String(m._id), m.name]))

    // Chuyển danh sách major của người dùng thành Set
    const userMajors = new Set(ideaData.major.map(String))

    // 1. Kiểm tra field không hợp lệ
    const invalidFields = fields.filter((field) => {
      const fieldMajor = String(field.major)
      return !userMajors.has(fieldMajor)
    })

    if (invalidFields.length > 0) {
      const errorMessages = invalidFields.map((field) => {
        const fieldMajorName = majorMap.get(String(field.major)) || 'Unknown Major'
        const selectedMajors = [...userMajors].map((m) => majorMap.get(m) || 'Unknown Major')
        return `${field.name} requires major: ${fieldMajorName}, but you selected: ${selectedMajors.join(', ')}.`
      })
      throw new Error(errorMessages.join(' '))
    }

    // 2. Kiểm tra xem mỗi major có ít nhất 1 field liên quan không
    const fieldMajorsSet = new Set(fields.map((field) => String(field.major)))
    const missingMajors = ideaData.major.filter((major) => !fieldMajorsSet.has(major.toString()))

    if (missingMajors.length > 0) {
      const missingMajorNames = missingMajors.map((m) => majorMap.get(m) || 'Unknown Major')
      throw new Error(`You must select at least one field for the following majors: ${missingMajorNames.join(', ')}.`)
    }

    return runTransaction(async (session) => {
      try {
        const idea = new this.projectModel({
          ...ideaData,
          histories: [],
          tasks: [],
          slow_count: 0,
          supervisor: [],
          category: 1,
          status: PROJECT_STATUS.PENDING
        })

        await idea.save({ session })
        await this.userModel.updateOne(
          { _id: ideaData.leader },
          { $set: { status: USER_STATUS.ACTIVATED, project: idea._id } },
          { session }
        )
        return idea
      } catch (error) {
        throw new HttpException('Failed to create idea', 500)
      }
    })
  }
  async getIdeaStudent(userIds: string[]) {
    return runTransaction(async (session) => {
      const projects = await this.projectModel
        .find({
          $or: [{ members: { $in: userIds } }, { supervisor: { $in: userIds } }]
        })
        .populate('leader')
        .populate('supervisor')
        .populate('major')
        .populate('field')
        .populate('campus')
        .populate('supervisor')
        .populate({
          path: 'members',
          populate: [
            {
              path: 'major'
            },
            {
              path: 'field'
            }
          ]
        })
        .populate({
          path: 'documents',
          populate: [
            {
              path: 'user'
            }
          ]
        })
        .session(session)
        .exec()

      if (!projects) {
        throw new HttpException('Error at getting projects', 400)
      }
      if (projects.length) {
        return projects[0] ?? null
      }
    })
  }
  async getIdeaSupervisor() {
    const IdeaOfSupervisor = await this.projectModel.find({ category: 2 }).populate('supervisor')
    return IdeaOfSupervisor
  }
  async getIdeaSupervisorJoin(supervisorId: string): Promise<IProject[]> {
    // Kiểm tra tính hợp lệ của supervisorId
    if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
      throw new HttpException('Invalid supervisor ID', 400)
    }
    const supervisor = await this.userModel.findById(supervisorId)
    if (!supervisor) {
      throw new HttpException('Supervisor not found', 404)
    }
    if (!(supervisor?.roles ?? []).includes('supervisor')) {
      throw new HttpException('This user is not a supervisor', 403)
    }
    try {
      const projects = await this.projectModel
        .find({ supervisor: { $in: [supervisorId] } })
        .populate({
          path: 'leader',
          select: 'first_name last_name display_name email avatar' // Lấy các trường cần thiết
        })
        .populate({
          path: 'members',
          select: 'first_name last_name display_name email avatar'
        })
        .populate({
          path: 'supervisor',
          select: 'first_name last_name display_name email avatar'
        })
        .populate({
          path: 'major',
          select: 'name description'
        })
        .populate({
          path: 'field',
          select: 'name description'
        })
        .populate({
          path: 'campus',
          select: 'name'
        })
        .exec()

      if (!projects || projects.length === 0) {
        throw new HttpException('No projects found for this supervisor', 404)
      }

      return projects
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException('Failed to fetch projects for supervisor', 500)
    }
  }
  async deleteIdea(projectId: string, userId: string) {
    // kiem tra date deadline
    const getDeadline = await this.deadlineModel.findOne({ deadline_key: 'create_group' })
    if (!getDeadline || !getDeadline.deadline_date) {
      throw new HttpException('Deadline create group configuration is missing', 500)
    }
    if (new Date() > new Date(getDeadline.deadline_date)) {
      throw new HttpException(
        'The deadline for you to delete your current idea has expired. Please continue to complete this idea.',
        400
      )
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new HttpException('Invalid project ID', 400)
    }
    return runTransaction(async (session) => {
      const project = await this.projectModel
        .findOne({ _id: { $eq: projectId } })
        .session(session)
        .exec()
      if (!project) {
        throw new HttpException('Project not found', 404)
      }
      if (project?.leader?.valueOf() !== userId) {
        throw new HttpException('You are not the leader of this idea', 403)
      }
      await this.projectModel
        .deleteOne({ _id: { $eq: projectId } })
        .session(session)
        .exec()
      if (project?.members && project?.members.length > 0) {
        const memberIds = (project.members as IUser[]).map((member: IUser) => member._id)
        await this.userModel
          .updateMany(
            { _id: { $in: memberIds } },
            { $set: { status: USER_STATUS.UN_GROUPED, project: null } },
            { session }
          )
          .exec()
      }
      if (project?.supervisor && project?.supervisor.length > 0) {
        const supervisorIds = (project.supervisor as IUser[]).map((supervisor: IUser) => supervisor._id)
        await this.userModel
          .updateMany(
            { _id: { $in: supervisorIds } },
            { $set: { status: USER_STATUS.AVAILABLE, project: null } },
            { session }
          )
          .exec()
      }
      await this.inviteModel
        .deleteMany({ project: { $eq: projectId } })
        .session(session)
        .exec()
    })
  }
  async changeIdea(projectId: string, updateIdea: UpdateIdeaDto, userId: string): Promise<IProject> {
    const getDeadline = await this.deadlineModel.findOne({ deadline_key: 'create_group' })
    if (!getDeadline || !getDeadline.deadline_date) {
      throw new HttpException('Deadline create group configuration is missing', 500)
    }
    if (new Date() > new Date(getDeadline.deadline_date)) {
      throw new HttpException(
        'The deadline for you to change your current idea has expired. Please continue to complete this idea.',
        400
      )
    }
    // Kiểm tra các trường bắt buộc
    const requiredFields: (keyof UpdateIdeaDto)[] = ['name', 'description']
    const missingFields = requiredFields.filter((field) => !updateIdea[field])

    if (missingFields.length > 0) {
      throw new HttpException(`${missingFields.join(', ')} are required`, 400)
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new HttpException('Invalid project ID', 400)
    }
    return runTransaction(async (session) => {
      try {
        const project = await this.projectModel.findById(projectId).session(session).exec()

        if (!project) {
          throw new HttpException('Project not found', 404)
        }

        // Kiểm tra quyền của người dùng
        if (String(project.leader) !== userId) {
          throw new HttpException('You are not the leader of this idea', 403)
        }

        // Cập nhật thông tin dự án
        const { name, description } = updateIdea

        if (name) project.name = name
        if (description) project.description = description

        project.updated_at = new Date() // Cập nhật thời gian sửa đổi

        await project.save({ session })

        return project
      } catch (error) {
        throw error instanceof HttpException ? error : new HttpException('Failed to update idea', 500)
      }
    })
  }
  async memberLeaveGroup(projectId: string, userId: string) {
    // kiem tra date deadline
    const getDeadline = await this.deadlineModel.findOne({ deadline_key: 'create_group' })
    if (!getDeadline || !getDeadline.deadline_date) {
      throw new HttpException('Deadline create group configuration is missing', 500)
    }
    if (new Date() > new Date(getDeadline.deadline_date)) {
      throw new HttpException(
        'The deadline for you to leave your current group has passed. Please continue to complete this idea.',
        400
      )
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new HttpException('Invalid user ID', 400)
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new HttpException('Invalid project ID', 400)
    }
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const project = await this.projectModel
        .findOne({ _id: { $eq: projectId } })
        .populate<{ leader: IUser }>('leader')
        .populate<{ members: IUser[] }>('members')
        .populate<{ supervisor: IUser[] }>('supervisor')
        .session(session)
        .exec()
      const user = await this.userModel.findById(userId).session(session).exec()
      if (!user) {
        throw new HttpException('User not found', 404)
      }
      if (!project) {
        throw new HttpException('Project not found', 404)
      }
      const isMember = (project.members as IUser[]).some((member: IUser) => member._id?.valueOf() === userId)
      const isSupervisor = (project.supervisor as IUser[]).some(
        (supervisor: IUser) => supervisor._id?.valueOf() === userId
      )
      if (isMember && !(project.members as IUser[]).map((member: IUser) => member._id?.valueOf()).includes(userId)) {
        throw new HttpException('User is not a member of the project', 400)
      }
      if (
        isSupervisor &&
        !(project.supervisor as IUser[]).map((supervisor: IUser) => supervisor._id?.valueOf()).includes(userId)
      ) {
        throw new HttpException('User is not a supervisor of the project', 400)
      }
      if (project?.leader?._id?.valueOf() === userId) {
        throw new HttpException('You are the leader of this idea. Please delete the idea instead.', 400)
      }
      let newStatus: number
      if (isMember) {
        project.members = (project?.members as IUser[]).filter(
          (member: IUser) => (member?._id as mongoose.Types.ObjectId).valueOf() !== userId
        )
        // user.status = USER_STATUS.UN_GROUPED
        newStatus = USER_STATUS.UN_GROUPED
      } else if (isSupervisor) {
        project.supervisor = (project.supervisor as IUser[]).filter(
          (supervisor: IUser) => (supervisor._id as mongoose.Types.ObjectId).valueOf() !== userId
        )
        newStatus = USER_STATUS.AVAILABLE
      } else {
        throw new HttpException('User is neither a member nor a supervisor of the project', 400)
      }
      // await this.userModel.updateOne({ _id: userId }, { $set: { project: null } }, { session })
      // await project.save({ session })
      project.status = PROJECT_STATUS.PENDING
      await project.save({ session })
      // await user.save({ session })
      await this.userModel.updateOne({ _id: userId }, { $set: { status: newStatus, project: null } }, { session })
      await session.commitTransaction()
      const toEmails = [
        ...(project.members as IUser[]).map((member: IUser) => member.email), // Lấy email của các thành viên
        ...(project.supervisor as IUser[]).map((supervisor: IUser) => supervisor.email) // Lấy email của các giám sát viên
      ]

      this.emailQueue.addEmailJob({
        to: toEmails, // Gửi đến mọi người trong nhóm
        subject: 'Someone Has Left the Project',
        templateName: 'member-leave-group',
        context: {
          left_user_name: user.display_name,
          project_name: project.name,
          projectUrl: `${process.env.CLIENT_URL}/team`,
          sentTime: format(new Date(), 'h:mm a dd/MM/yyyy')
        }
      })
      return project
    } catch (error) {
      await session.abortTransaction()
      console.error('Error in Member Leave Group:', error)
      throw error instanceof HttpException ? error : new HttpException('Internal server error', 500)
    } finally {
      session.endSession()
    }
  }
  async leaderKickMember(projectId: string, memberId: string, leaderId: string) {
    const getDeadline = await this.deadlineModel.findOne({ deadline_key: 'create_group' })
    if (!getDeadline || !getDeadline.deadline_date) {
      throw new HttpException('Deadline create group configuration is missing', 500)
    }
    if (new Date() > new Date(getDeadline.deadline_date)) {
      throw new HttpException(
        'The deadline for you to kick member your current group has passed. Please continue to complete this idea.',
        400
      )
    }
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const project = await this.projectModel
        .findOne({ _id: { $eq: projectId } })
        .populate<{ leader: IUser }>('leader')
        .populate<{ members: IUser[] }>('members')
        .populate<{ supervisor: IUser[] }>('supervisor')
        .session(session)
        .exec()
      const member = await this.userModel
        .findOne({ _id: { $eq: memberId } })
        .session(session)
        .exec()
      const leader = await this.userModel
        .findOne({ _id: { $eq: leaderId } })
        .session(session)
        .exec()
      if ((project?.leader as IUser)._id?.valueOf() !== leaderId) {
        throw new HttpException('You dont have permission to kick member', 400)
      }
      if (!member || !leader) {
        throw new HttpException('User not found', 404)
      }
      if (!project) {
        throw new HttpException('Project not found', 404)
      }
      if (!(project?.members as IUser[]).some((member: IUser) => member?._id?.valueOf() === memberId)) {
        throw new HttpException('This user is not a member of the project', 400)
      }
      project.members = (project?.members as IUser[]).filter(
        (member: IUser) => (member?._id as mongoose.Types.ObjectId).valueOf() !== memberId
      )
      project.status = PROJECT_STATUS.PENDING
      await project.save({ session })
      await this.userModel.updateOne(
        { _id: { $eq: memberId } },
        { $set: { project: null, status: USER_STATUS.UN_GROUPED } },
        { session }
      )
      await session.commitTransaction()
      const toEmails = [
        ...(project.members as IUser[]).map((member: IUser) => member.email), // Lấy email của các thành viên
        ...(project.supervisor as IUser[]).map((supervisor: IUser) => supervisor.email) // Lấy email của các giám sát viên
      ]
      this.emailQueue.addEmailJob({
        to: toEmails, // Gửi đến mọi người trong nhóm
        subject: 'Member Has Been Kicked Out',
        templateName: 'leader-kick-member',
        context: {
          member: member.display_name,
          leader: leader.display_name,
          project_name: project.name,
          projectUrl: `${process.env.CLIENT_URL}/team`,
          sentTime: format(new Date(), 'h:mm a dd/MM/yyyy')
        }
      })

      this.emailQueue.addEmailJob({
        to: member.email, // Gửi đến người bị kick
        subject: 'You Have Been Kicked Out',
        templateName: 'member-kicked',
        context: {
          member: member.display_name,
          leader: leader.display_name,
          leader_email: leader.email,
          project_name: project.name,
          projectUrl: `${process.env.CLIENT_URL}/team`,
          sentTime: format(new Date(), 'h:mm a dd/MM/yyyy')
        }
      })
      return project
    } catch (error) {
      await session.abortTransaction()
      console.error('Error in Leader Kick Member:', error)
      throw error instanceof HttpException ? error : new HttpException('Internal server error', 500)
    } finally {
      session.endSession()
    }
  }
}
