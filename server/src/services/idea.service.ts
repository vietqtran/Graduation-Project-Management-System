import mongoose from 'mongoose'
import { FilterQuery, Model, UpdateQuery } from 'mongoose'
import ProjectModel, { IProject } from '@/models/project.model'
import UserModel, { IUser } from '@/models/user.model'
import { CreateIdeaDto, UpdateIdeaDto } from '@/dtos/idea/create-idea.dto'
import { HttpException } from '@/shared/exceptions/http.exception'
import { runTransaction } from '@/helpers/transaction-helper'
import { USER_STATUS } from '@/constants/status'
import { EmailQueue } from '@/queues/email.queue'
import { MailService } from './mail.service'
import { format } from 'date-fns'
import { PROJECT_STATUS } from '@/constants/status'
import DeadlineModel, { IDeadline } from '@/models/deadline.model'
import InviteModel, { IInvite } from '@/models/invite.model'

export class IdeaService {
  private readonly projectModel: Model<IProject>
  private readonly userModel: Model<IUser>
  private readonly emailQueue: EmailQueue
  private readonly mailService: MailService
  private readonly deadlineModel: Model<IDeadline>
  private readonly inviteModel: Model<IInvite>
  constructor() {
    this.projectModel = ProjectModel
    this.userModel = UserModel
    this.mailService = new MailService()
    this.emailQueue = new EmailQueue(this.mailService)
    this.deadlineModel = DeadlineModel
    this.inviteModel = InviteModel
  }

  async createIdea(ideaData: CreateIdeaDto): Promise<IProject> {
    const getDeadline = await this.deadlineModel.findOne({ deadline_key: 'create_idea' })
    if (getDeadline?.deadline_date && new Date() > new Date(getDeadline.deadline_date)) {
      throw new HttpException('The deadline for creating ideas has passed', 400)
    }
    // Kiểm tra các trường bắt buộc trong một lần
    const requiredFields: (keyof CreateIdeaDto)[] = ['name', 'campus', 'leader', 'members', 'field', 'major']
    const missingFields = requiredFields.filter((field) => !ideaData[field])

    if (missingFields.length > 0) {
      throw new HttpException(`${missingFields.join(', ')} are required`, 400)
    }
    if (typeof ideaData.leader !== 'string') {
      throw new HttpException('Invalid leader ID', 400)
    }
    const user = await this.userModel.findById(ideaData.leader)
    if (!user?.roles?.includes('student')) {
      throw new HttpException('This action is only available for students', 404)
    }
    const existingIdea = await this.projectModel.findOne({
      members: { $in: [{ $eq: ideaData.leader }] } // Kiểm tra xem userId có nằm trong mảng members không
    })

    if (existingIdea) {
      throw new HttpException(
        'You are already part of an existing idea. Please leave it before creating a new one.',
        400
      )
    }

    return runTransaction(async (session) => {
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
      await this.userModel.updateOne({ _id: ideaData.leader }, { $set: { status: USER_STATUS.ACTIVATED } }, { session })
      return idea
    })
  }
  async getIdeaStudent(userIds: string[]) {
    return runTransaction(async (session) => {
      const projects = await this.projectModel
        .find({
          members: { $in: userIds }
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
  async deleteIdea(projectId: string, userId: string) {
    // kiem tra date deadline
    const getDeadline = await this.deadlineModel.findOne({ deadline_key: 'create_group' })
    if (getDeadline?.deadline_date && new Date() > new Date(getDeadline.deadline_date)) {
      throw new HttpException(
        'The deadline for you to delete your current idea has expired. Please continue to complete this idea.',
        400
      )
    }
    return runTransaction(async (session) => {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new HttpException('Invalid project ID', 400)
      }
      const project = await this.projectModel
        .findOne({ _id: { $eq: projectId } })
        .session(session)
        .exec()
      if (project?.leader?.valueOf() !== userId) {
        throw new HttpException('You are not the leader of this idea', 400)
      }
      await this.projectModel
        .deleteOne({ _id: { $eq: projectId } })
        .session(session)
        .exec()
      if (project.members && project.members.length > 0) {
        await this.userModel
          .updateMany(
            { _id: { $in: (project.members as IUser[]).map((member: IUser) => member._id) } },
            { $set: { status: USER_STATUS.UN_GROUPED } },
            { session }
          )
          .exec()
      }
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new HttpException('Invalid project ID', 400)
      }

      await this.inviteModel
        .deleteMany({ project: { $eq: projectId } })
        .session(session)
        .exec()
    })
  }
  async changeIdea(projectId: string, updateIdea: UpdateIdeaDto, userId: string): Promise<IProject> {
    const getDeadline = await this.deadlineModel.findOne({ deadline_key: 'create_group' })
    if (getDeadline?.deadline_date && new Date() > new Date(getDeadline.deadline_date)) {
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

    return runTransaction(async (session) => {
      const project = await this.projectModel.findById(projectId).session(session).exec()

      if (!project) {
        throw new HttpException('Project not found', 404)
      }

      // Kiểm tra quyền của người dùng
      if (String(project.leader) !== userId) {
        throw new HttpException('You are not the leader of this idea', 400)
      }

      // Cập nhật thông tin dự án
      const { name, description } = updateIdea

      if (name) project.name = name
      if (description) project.description = description

      project.updated_at = new Date() // Cập nhật thời gian sửa đổi

      await project.save({ session })

      return project
    })
  }
  async memberLeaveGroup(projectId: string, userId: string) {
    // kiem tra date deadline
    const getDeadline = await this.deadlineModel.findOne({ deadline_key: 'create_group' })
    if (getDeadline?.deadline_date && new Date() > new Date(getDeadline.deadline_date)) {
      throw new HttpException(
        'The deadline for you to leave your current group has passed. Please continue to complete this idea.',
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
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new HttpException('Invalid user ID', 400)
      }

      const user = await this.userModel.findById(userId).session(session).exec()
      if (!user) {
        throw new HttpException('User not found', 404)
      }
      if (!project) {
        throw new HttpException('Project not found', 404)
      }
      if (!(project.members as IUser[]).map((member: IUser) => member._id?.valueOf()).includes(userId)) {
        throw new HttpException('User is not a member of the project', 400)
      }
      if (project?.leader?._id?.valueOf() === userId) {
        throw new HttpException('You are the leader of this idea. Please delete the idea instead.', 400)
      }
      project.members = (project.members as IUser[]).filter(
        (member: IUser) => (member._id as mongoose.Types.ObjectId).valueOf() !== userId
      )
      await project.save({ session })
      user.status = USER_STATUS.UN_GROUPED
      project.status = PROJECT_STATUS.PENDING
      await project.save({ session })
      await user.save({ session })
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
      throw error
    } finally {
      session.endSession()
    }
  }
  async leaderKickMember(projectId: string, memberId: string, leaderId: string) {
    const getDeadline = await this.deadlineModel.findOne({ deadline_key: 'create_group' })
    if (getDeadline?.deadline_date && new Date() > new Date(getDeadline.deadline_date)) {
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
      if (!(project.members as IUser[]).map((member: IUser) => member._id?.valueOf()).includes(memberId)) {
        throw new HttpException('This user is not a member of the project', 400)
      }
      project.members = (project.members as IUser[]).filter(
        (member: IUser) => (member._id as mongoose.Types.ObjectId).valueOf() !== memberId
      )
      await project.save({ session })
      member.status = USER_STATUS.UN_GROUPED
      await member.save({ session })
      project.status = PROJECT_STATUS.PENDING
      await project.save({ session })
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
      throw error
    } finally {
      session.endSession()
    }
  }
}
