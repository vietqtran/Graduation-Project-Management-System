import { Model, Types } from 'mongoose'
import { PROJECT_STATUS, STATUS_MASTER, USER_STATUS } from '@/constants/status'
import ProjectModel, { IProject } from '@/models/project.model'
import {
  StaffGetDetailProjectDto,
  StaffGetListProjectsDto,
  StaffUpdateProjectDto,
  staffGetListAvailableStudentsDto,
  staffGetListAvailableSupervisorsDto
} from '@/dtos/project/staff-manage-projects.dto'
import UserModel, { IUser } from '@/models/user.model'
import { getCurrentSemester, getSemesterDates, getSemesterFromDate } from '@/helpers/date-helper'

import { EmailQueue } from '@/queues/email.queue'
import { HttpException } from '@/shared/exceptions/http.exception'
import { IParameter } from '@/models/parameter.model'
import { MailService } from './mail.service'
import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import { runTransaction } from '@/helpers/transaction-helper'
import { send } from 'process'

export class ProjectService {
  private readonly projectModel: Model<IProject>
  private readonly userModel: Model<IUser>
  private readonly parameterModel: Model<IParameter>
  private readonly emailQueue: EmailQueue
  private readonly mailService: MailService

  constructor() {
    this.projectModel = ProjectModel
    this.userModel = UserModel
    this.mailService = new MailService()
    this.emailQueue = new EmailQueue(this.mailService)
  }

  async create(projectData: Omit<IProject, '_id' | 'histories' | 'tasks' | 'mark' | 'slow_count'>) {
    return runTransaction(async (session) => {
      const project = await this.projectModel.create(
        {
          ...projectData,
          histories: [],
          tasks: [],
          slow_count: 0
        },
        { session }
      )
      if (!project) {
        throw new HttpException('Error at creating project', 400)
      }
      return project
    })
  }

  async getByUserIds(userIds: string[]) {
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

  async staffGetListProjects(body: StaffGetListProjectsDto) {
    return runTransaction(async (session) => {
      const {
        name,
        major,
        field,
        campus,
        mark,
        category,
        status,
        stage,
        slow_count,
        noMembers,
        supervisorName,
        semester,
        page,
        limit,
        sort
      } = body

      const { startDate, endDate } = getSemesterDates(semester)

      const filter: any = {}

      if (name) filter.name = { $regex: name, $options: 'i' }
      if (major) filter.major = { $in: [major] }
      if (field) filter.field = { $in: [field] }
      if (campus) filter.campus = campus
      if (mark) filter.mark = mark
      if (category) filter.category = category
      if (status) filter.status = status
      if (stage) filter.stage = stage
      if (slow_count) filter.slow_count = slow_count
      if (noMembers) filter.members = { $size: noMembers }
      if (supervisorName) {
        const supervisor = await this.userModel
          .find({ display_name: { $regex: supervisorName, $options: 'i' } })
          .session(session)
        filter.supervisor = { $in: supervisor.map((s) => s._id) }
      }
      filter.created_at = { $gte: startDate, $lt: endDate }

      const projects = await this.projectModel
        .find(filter)
        .populate({ path: 'major', select: 'name' })
        .populate({ path: 'field', select: 'name' })
        .populate({ path: 'campus', select: 'name' })
        .populate({
          path: 'supervisor',
          select: '_id display_name username email avatar'
        })
        .populate({
          path: 'members',
          select: '_id'
        })
        .populate({
          path: 'created_by',
          select: '_id display_name username email avatar'
        })
        .populate({
          path: 'updated_by',
          select: '_id display_name username email avatar'
        })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          'name major field campus mark category status stage slow_count members supervisor created_at updated_at created_by updated_by'
        )
        .session(session)

      if (!projects) {
        throw new HttpException('Error at getting projects', 400)
      }

      const formattedProjects = projects.map((project) => ({
        _id: project._id,
        name: project.name,
        major: project.major?.map((m: any) => m.name) || [],
        field: project.field?.map((f: any) => f.name) || [],
        campus: project.campus ? (project.campus as any).name : undefined,
        mark: project.mark,
        category: project.category,
        status: project.status,
        stage: project.stage,
        slow_count: project.slow_count,
        noMembers: project.members?.length,
        supervisor: project.supervisor,
        created_by: project.created_by,
        updated_by: project.updated_by,
        created_at: project.created_at,
        updated_at: project.updated_at
      }))

      return {
        list: formattedProjects,
        total: formattedProjects.length
      }
    })
  }

  async staffGetDetailProject(body: StaffGetDetailProjectDto) {
    return runTransaction(async (session) => {
      const { _id: projectId } = body
      const project = await this.projectModel
        .findById(projectId)
        .populate({ path: 'major', select: '_id name' })
        .populate({ path: 'field', select: '_id name' })
        .populate({ path: 'campus', select: '_id name' })
        .populate({
          path: 'supervisor',
          select: '_id display_name username email avatar'
        })
        .populate({
          path: 'leader',
          select: '_id display_name username email avatar'
        })
        .populate({
          path: 'members',
          select: '_id display_name username email avatar'
        })
        .populate({
          path: 'created_by',
          select: '_id display_name username email avatar'
        })
        .populate({
          path: 'updated_by',
          select: '_id display_name username email avatar'
        })
        .select(
          'name major field campus mark category status stage slow_count members supervisor created_at updated_at created_by updated_by description leader'
        )
        .session(session)

      if (!project) {
        throw new HttpException('Project not found', 404)
      }

      const formattedProject = {
        _id: project._id,
        name: project.name,
        major: project.major,
        field: project.field,
        campus: project.campus,
        mark: project.mark,
        category: project.category,
        status: project.status,
        stage: project.stage,
        slow_count: project.slow_count,
        noMembers: project.members?.length,
        supervisor: project.supervisor,
        members: project.members,
        description: project.description,
        leader: project.leader,
        semester: project.created_at ? getSemesterFromDate(project.created_at) : null,
        created_by: project.created_by,
        updated_by: project.updated_by,
        created_at: project.created_at,
        updated_at: project.updated_at
      }

      return formattedProject
    })
  }

  async staffUpdateProject(body: StaffUpdateProjectDto, tokenPayload: TokenPayload) {
    const { _id: projectId, ...data } = body
    return runTransaction(async (session) => {
      const project = await this.projectModel.findById(projectId).session(session)
      if (!project) {
        throw new HttpException('Project not found', 404)
      }

      //member project này không được trùng member project khác
      // const availableStudents = (await this.staffGetListAvailableStudents({ search: '' }))
      // const availableStudentsIds = availableStudents.map((s) => s._id)
      // const newMembers = data.members.filter(m => project?.members.map((m: any) => m._id).includes(m)).filter((memberId) => !availableStudentsIds.includes(memberId));
      // if (newMembers.length > 0) {
      //   const memberNames = newMembers.map((memberId) => availableStudents.find((s) => s._id === memberId)?.display_name);
      //   throw new HttpException(`Members ${memberNames.join(', ')} are not available`, 404);
      // }

      // const availableSupervisors = (await this.staffGetListAvailableSupervisors({ search: '' }))
      // const availableSupervisorsIds = availableSupervisors.map((s) => s._id)
      // if (data.supervisor) {
      //   for (const supervisorId of data.supervisor) {
      //     if (!availableSupervisorsIds.includes(supervisorId)) {
      //       const supervisorName = (await UserModel.findById(supervisorId))?.display_name
      //       throw new HttpException(`Supervisor ${supervisorName} is not available`, 404)
      //     }
      //   }
      // }

      // const maxGroupsPerTeacher = await this.parameterModel
      //   .findOne({ param_name: 'MaxGroupsPerTeacher' })
      //   .session(session)
      // if (!maxGroupsPerTeacher) {
      //   throw new HttpException('Parameter MaxGroupsPerTeacher not found', 404)
      //   // maxGroupsPerTeacher = { param_value: 5, param_type: 'number' }
      // }

      // const maxGroupsPerTeacherValue = convertType(maxGroupsPerTeacher?.param_value, maxGroupsPerTeacher?.param_type)
      // //supervisor project này phải có số project <= 5
      // if (data.supervisor) {
      //   data.supervisor.forEach(async (supervisorId: string) => {
      //     const projects = await this.projectModel.find({ supervisor: supervisorId }).session(session)
      //     if (projects.length >= maxGroupsPerTeacherValue) {
      //       throw new HttpException(
      //         `Supervisor ${projects.find((s) => s.supervisor.includes(supervisorId))?.name} already has more than ${maxGroupsPerTeacherValue} projects`,
      //         400
      //       )
      //     }
      //   })
      // }

      project.name = data.name
      project.major = data.major
      project.field = data.field
      project.campus = data.campus
      if (data.mark) project.mark = data.mark
      project.category = data.category
      project.status = data.status
      project.stage = data.stage
      project.slow_count = data.slow_count

      project.members = data.members
      project.supervisor = data.supervisor
      project.leader = data.leader
      project.updated_by = tokenPayload._id
      project.updated_at = new Date()

      if (data.description) project.description = data.description

      await project.save({ session })
    })
  }

  async staffGetListAvailableStudents(body: staffGetListAvailableStudentsDto) {
    const { search = '', projectId } = body
    const currentSemester = getCurrentSemester()
    return runTransaction(async (session) => {
      const students = await this.userModel
        .find({
          roles: 'student',
          planned_semester: currentSemester,
          status: USER_STATUS.UN_GROUPED,
          $or: [{ display_name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
          //if projectId is truthy, filter by projectId
          ...(projectId && { project: { $ne: projectId } })
        })
        .select('display_name username email avatar')
        .session(session)

      return students
    })
  }

  async staffGetListAvailableSupervisors(body: staffGetListAvailableSupervisorsDto) {
    const { search = '', projectId } = body
    return runTransaction(async (session) => {
      const supervisors = await this.userModel
        .find({
          roles: 'supervisor',
          status: USER_STATUS.AVAILABLE,
          $or: [{ display_name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
          ...(projectId && { project: { $ne: projectId } })
        })
        .select('display_name username email avatar')
        .session(session)

      return supervisors
    })
  }

  async createProjectAsTopic(
    projectData: Omit<
      IProject,
      | '_id'
      | 'histories'
      | 'tasks'
      | 'mark'
      | 'slow_count'
      | 'status'
      | 'created_by'
      | 'updated_by'
      | 'created_at'
      | 'updated_at'
    >,
    tokenPayload: TokenPayload
  ) {
    return runTransaction(async (session) => {
      let leaderId = null
      let status = null
      let leaderEmail = ''

      if (projectData.leader) {
        const user = await this.userModel.findOne(
          { email: { $eq: projectData.leader } },
          { _id: 1, email: 1 },
          { session }
        )

        if (user) {
          leaderId = user._id
          leaderEmail = user.email
          status = 17
        } else {
          throw new HttpException('Leader email not found in users table', 404)
        }
      }

      // Create the project
      const project = await this.projectModel.create(
        [
          {
            name: projectData.name,
            description: projectData.description || '',
            major: projectData.major,
            field: projectData.field,
            campus: projectData.campus,
            category: projectData.category,
            supervisor: tokenPayload._id || [],
            members: [],
            documents: projectData.documents || [],
            histories: [],
            tasks: [],
            mark: null,
            slow_count: 0,
            updated_by: tokenPayload._id,
            leader: leaderId, // Set leaderId if available
            status: status || 26, // Set status if available
            stage: 1,
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        { session }
      )

      if (!project) {
        throw new HttpException('Error at creating project as topic', 400)
      }

      // Prepare email content
      const projectDetails = {
        name: projectData.name,
        description: projectData.description || 'No description provided.',
        major: projectData.major,
        field: projectData.field,
        campus: projectData.campus,
        category: projectData.category
      }

      const updater = await this.userModel.findById(tokenPayload._id, { email: 1 }).session(session)
      if (!updater) {
        throw new HttpException('User not found for the updater', 404)
      }

      // 2. Email content for the person who updated the project
      const updateEmailContent = {
        to: updater.email, // Use the email of the updater
        subject: 'Project Created Successfully',
        templateName: 'project-update-notification',
        context: {
          first_name: updater.first_name, // Assuming first_name is available in user model
          last_name: updater.last_name, // Assuming last_name is available in user model
          projectDetails,
          year: new Date().getFullYear(),
          start_url: process.env.CLIENT_URL
        }
      }

      // 3. Email content for the project leader
      const leader = await this.userModel.findById(leaderId, { email: 1, first_name: 1, last_name: 1 }).session(session)
      if (!leader) {
        throw new HttpException('Leader not found', 404)
      }

      const leaderEmailContent = {
        to: leader.email, // Send email to the leader
        subject: 'You Have Been Added to a New Project',
        templateName: 'leader-project-notification',
        context: {
          leader_name: leader.first_name + ' ' + leader.last_name, // Concatenate first and last name of the leader
          projectDetails,
          year: new Date().getFullYear(),
          start_url: process.env.CLIENT_URL
        }
      }

      // 4. Add email jobs to the queue
      await this.emailQueue.addEmailJob(updateEmailContent) // Add job for the person who updated
      await this.emailQueue.addEmailJob(leaderEmailContent) // Add job for the leader

      return project
    })
  }

  async getProjectsWithNullStatus(userId: string) {
    return runTransaction(async (session) => {
      const projects = await this.projectModel
        .find({ status: 26, category: 2, created_by: { $ne: userId } }) // Lọc các dự án có status là null va category 2
        .populate('created_by')
        .populate('leader')
        .populate('supervisor')
        .populate('major')
        .populate('field')
        .populate('campus')
        .populate('members')
        .session(session)
        .exec()

      if (!projects || projects.length === 0) {
        throw new HttpException('No projects found with null status', 404)
      }

      return projects
    })
  }

  async deleteTopic(projectId: string) {
    return runTransaction(async (session) => {
      const project = await this.projectModel.findOneAndDelete({ _id: projectId, status: null }).session(session)

      if (!project) {
        throw new HttpException('Project not found or project has a status other than null', 404)
      }

      return { message: 'Project deleted successfully' }
    })
  }

  async updateTopic(
    projectId: string,
    updateData: Partial<Omit<IProject, '_id' | 'created_by' | 'created_at' | 'updated_at'>>,
    tokenPayload: TokenPayload
  ) {
    return runTransaction(async (session) => {
      const project = await this.projectModel.findOne({ _id: projectId }).session(session)

      if (!project) {
        throw new HttpException('Project not found', 404)
      }

      // Cập nhật thông tin project
      const updatedProject = await this.projectModel.updateOne(
        { _id: projectId },
        {
          $set: {
            name: updateData.name ?? project.name,
            description: updateData.description ?? project.description,
            major: updateData.major ?? project.major,
            field: updateData.field ?? project.field,
            campus: updateData.campus ?? project.campus,
            category: updateData.category ?? project.category,
            supervisor: updateData.supervisor ?? project.supervisor,
            members: updateData.members ?? project.members,
            documents: updateData.documents ?? project.documents,
            histories: updateData.histories ?? project.histories,
            tasks: updateData.tasks ?? project.tasks,
            mark: updateData.mark ?? project.mark,
            slow_count: updateData.slow_count ?? project.slow_count,
            status: updateData.status ?? project.status,
            stage: updateData.stage ?? project.stage,
            updated_by: tokenPayload._id,
            updated_at: new Date()
          }
        },
        { session }
      )

      if (updatedProject.matchedCount === 0) {
        throw new HttpException('Failed to update project', 400)
      }

      return { message: 'Project updated successfully' }
    })
  }

  async getTopicDetail(projectId: string) {
    return runTransaction(async (session) => {
      const project = await this.projectModel
        .findOne({ _id: projectId })
        .populate({ path: 'major', select: '_id name' })
        .populate({ path: 'field', select: '_id name' })
        .populate({ path: 'campus', select: '_id name' })
        .populate({ path: 'supervisor', select: '_id display_name username email avatar' })
        .populate({ path: 'leader', select: '_id display_name username email avatar' })
        .populate({ path: 'members', select: '_id display_name username email avatar' })
        .populate({ path: 'created_by', select: '_id display_name username email avatar' })
        .populate({ path: 'updated_by', select: '_id display_name username email avatar' })
        .session(session)

      if (!project) {
        throw new HttpException('Project not found', 404)
      }

      return {
        _id: project._id,
        name: project.name,
        description: project.description,
        major: project.major,
        field: project.field,
        campus: project.campus,
        category: project.category,
        status: project.status,
        stage: project.stage,
        mark: project.mark,
        slow_count: project.slow_count,
        members: project.members,
        supervisor: project.supervisor,
        leader: project.leader,
        created_by: project.created_by,
        updated_by: project.updated_by,
        created_at: project.created_at,
        updated_at: project.updated_at,
        histories: project.histories,
        documents: project.documents,
        tasks: project.tasks
      }
    })
  }

  async getProjectsBySupervisor(supervisorId: string) {
    return runTransaction(async (session) => {
      console.log('🔍 Supervisor ID from token:', supervisorId)

      const sampleProject = await this.projectModel.findOne().lean().exec()
      console.log('Sample project supervisor field structure:', sampleProject?.supervisor)

      let projects: any[] = []

      // Truy vấn theo chuỗi
      console.log('Attempting string query...')
      const stringQuery = await this.projectModel
        .find({ supervisor: supervisorId, status: STATUS_MASTER.APPROVED })
        .lean()
        .exec()
      console.log(`String query found ${stringQuery.length} projects`)
      projects = [...projects, ...stringQuery]

      // Truy vấn theo mảng string
      console.log('Attempting array string query...')
      const arrayStringQuery = await this.projectModel
        .find({ supervisor: { $in: [supervisorId] }, status: STATUS_MASTER.APPROVED })
        .lean()
        .exec()
      console.log(`Array string query found ${arrayStringQuery.length} projects`)
      projects = [...projects, ...arrayStringQuery]

      // Kiểm tra nếu supervisorId hợp lệ (ObjectId)
      if (Types.ObjectId.isValid(supervisorId)) {
        const objectId = new Types.ObjectId(supervisorId)

        console.log('Attempting ObjectId query...')
        const objectIdQuery = await this.projectModel
          .find({ supervisor: objectId, status: STATUS_MASTER.APPROVED })
          .lean()
          .exec()
        console.log(`ObjectId query found ${objectIdQuery.length} projects`)
        projects = [...projects, ...objectIdQuery]

        console.log('Attempting array ObjectId query...')
        const arrayObjectIdQuery = await this.projectModel
          .find({ supervisor: { $in: [objectId] }, status: STATUS_MASTER.APPROVED })
          .lean()
          .exec()
        console.log(`Array ObjectId query found ${arrayObjectIdQuery.length} projects`)
        projects = [...projects, ...arrayObjectIdQuery]
      }

      console.log('Attempting raw MongoDB query...')
      const rawQuery = await this.projectModel.collection
        .find({ supervisor: { $in: [supervisorId] }, status: STATUS_MASTER.APPROVED })
        .toArray()
      console.log(`Raw MongoDB query found ${rawQuery.length} documents`)
      projects = [...projects, ...rawQuery]

      // Truy vấn với populate
      console.log('Attempting populated query...')
      const populatedProjects = await this.projectModel
        .find({
          $or: [
            { supervisor: supervisorId, status: STATUS_MASTER.APPROVED },
            { supervisor: { $in: [supervisorId] }, status: STATUS_MASTER.APPROVED },
            ...(Types.ObjectId.isValid(supervisorId)
              ? [
                  { supervisor: new Types.ObjectId(supervisorId), status: STATUS_MASTER.APPROVED },
                  { supervisor: { $in: [new Types.ObjectId(supervisorId)] }, status: STATUS_MASTER.APPROVED }
                ]
              : [])
          ]
        })
        .populate('leader')
        .populate('supervisor')
        .populate('major')
        .populate('field')
        .populate('campus')
        .populate({
          path: 'members',
          populate: [
            { path: 'major', select: 'name' },
            { path: 'field', select: 'name' }
          ]
        })
        .populate({
          path: 'documents',
          populate: { path: 'user', select: 'display_name email' }
        })
        .session(session)
        .exec()
      console.log(`Populated projects found: ${populatedProjects.length}`)
      projects = [...projects, ...populatedProjects]

      if (!projects || projects.length === 0) {
        console.log('No projects found for supervisor after all query attempts')
        return []
      }

      // Loại bỏ project trùng lặp dựa trên _id
      const uniqueProjects = Array.from(
        new Map(
          projects
            .filter((p) => p && p._id) // Đảm bảo project có _id hợp lệ
            .map((p: any) => [p._id.toString(), p]) // Dùng Map để loại bỏ trùng
        ).values()
      )

      console.log(`Final unique projects count: ${uniqueProjects.length}`)
      return uniqueProjects
    })
  }

  async getProjectsToReview(supervisorId: string) {
    return runTransaction(async (session) => {
      console.log('🔍 Supervisor ID from token:', supervisorId)

      const sampleProject = await this.projectModel.findOne().lean().exec()
      console.log('Sample project supervisor field structure:', sampleProject?.supervisor)

      let projects: any[] = []

      // Truy vấn theo chuỗi
      console.log('Attempting string query...')
      const stringQuery = await this.projectModel.find({ supervisor: supervisorId }).lean().exec()
      console.log(`String query found ${stringQuery.length} projects`)
      projects = [...projects, ...stringQuery]

      // Truy vấn theo mảng string
      console.log('Attempting array string query...')
      const arrayStringQuery = await this.projectModel
        .find({ supervisor: { $in: [supervisorId] } })
        .lean()
        .exec()
      console.log(`Array string query found ${arrayStringQuery.length} projects`)
      projects = [...projects, ...arrayStringQuery]

      // Kiểm tra nếu supervisorId hợp lệ (ObjectId)
      if (Types.ObjectId.isValid(supervisorId)) {
        const objectId = new Types.ObjectId(supervisorId)

        console.log('Attempting ObjectId query...')
        const objectIdQuery = await this.projectModel.find({ supervisor: objectId }).lean().exec()
        console.log(`ObjectId query found ${objectIdQuery.length} projects`)
        projects = [...projects, ...objectIdQuery]

        console.log('Attempting array ObjectId query...')
        const arrayObjectIdQuery = await this.projectModel
          .find({ supervisor: { $in: [objectId] } })
          .lean()
          .exec()
        console.log(`Array ObjectId query found ${arrayObjectIdQuery.length} projects`)
        projects = [...projects, ...arrayObjectIdQuery]
      }

      console.log('Attempting raw MongoDB query...')
      const rawQuery = await this.projectModel.collection.find({ supervisor: { $in: [supervisorId] } }).toArray()
      console.log(`Raw MongoDB query found ${rawQuery.length} documents`)
      projects = [...projects, ...rawQuery]

      // Truy vấn với populate
      console.log('Attempting populated query...')
      const populatedProjects = await this.projectModel
        .find({
          $or: [
            { supervisor: supervisorId },
            { supervisor: { $in: [supervisorId] } },
            ...(Types.ObjectId.isValid(supervisorId)
              ? [
                  { supervisor: new Types.ObjectId(supervisorId) },
                  { supervisor: { $in: [new Types.ObjectId(supervisorId)] } }
                ]
              : [])
          ]
        })
        .populate('leader')
        .populate('supervisor')
        .populate('major')
        .populate('field')
        .populate('campus')
        .populate({
          path: 'members',
          populate: [
            { path: 'major', select: 'name' },
            { path: 'field', select: 'name' }
          ]
        })
        .populate({
          path: 'documents',
          populate: { path: 'user', select: 'display_name email' }
        })
        .session(session)
        .exec()
      console.log(`Populated projects found: ${populatedProjects.length}`)
      projects = [...projects, ...populatedProjects]

      if (!projects || projects.length === 0) {
        console.log('No projects found for supervisor after all query attempts')
        return []
      }

      // Loại bỏ project trùng lặp dựa trên _id
      const uniqueProjects = Array.from(
        new Map(
          projects
            .filter((p) => p && p._id) // Đảm bảo project có _id hợp lệ
            .map((p) => [p._id.toString(), p]) // Dùng Map để loại bỏ trùng
        ).values()
      )

      console.log(`Final unique projects count: ${uniqueProjects.length}`)
      return uniqueProjects
    })
  }

  async getProjectLeadersBySupervisor(supervisorId: string) {
    if (!supervisorId) {
      throw new HttpException('Supervisor ID is required', 400)
    }

    return runTransaction(async (session) => {
      try {
        console.log('🆔 Supervisor ID:', supervisorId)

        const supervisorObjectId = new Types.ObjectId(supervisorId)

        // Tìm project có leader hợp lệ
        const projects = await this.projectModel
          .find({
            supervisor: supervisorObjectId,
            leader: { $ne: null } // Chỉ lấy project có leader không null
          })
          .populate<{ leader: { id: string; name: string; email: string } }>('leader', 'id name email')
          .session(session)
          .exec()

        console.log('📌 Projects found:', projects.length)

        if (!projects.length) {
          return [] // Không có leader thì trả về mảng rỗng thay vì lỗi
        }

        // Lọc danh sách leader không trùng lặp
        const leaders: { id: string; name: string; email: string }[] = []

        for (const project of projects) {
          if (project.leader && !leaders.some((l) => l.id === project.leader.id)) {
            leaders.push(project.leader)
          }
        }

        console.log('👨‍💼 Leaders found:', leaders)

        return leaders
      } catch (error) {
        console.error('❌ Error in getProjectLeadersBySupervisor:', error)
      }
    })
  }

  async getProjectMembers(projectId: string) {
    const project = await ProjectModel.findById(projectId)
      .populate('members', 'username email avatar')
      .select('members')

    if (!project) {
      throw new HttpException('Project not found', 404)
    }

    return project.members
  }

  async approveIdea(projectId: string, status: STATUS_MASTER, userId: string) {
    return runTransaction(async (session) => {
      console.log(`🔍 Processing project approval - Project ID: ${projectId}, Status: ${status}`)

      const project = await this.projectModel.findOne({ _id: new Types.ObjectId(projectId) }).session(session)
      if (!project) {
        console.log('Project not found:', projectId)
        throw new HttpException('Project not found', 404)
      }

      const updatedProject = await this.projectModel.updateOne(
        { _id: new Types.ObjectId(projectId) },
        {
          $set: {
            status: status,
            updated_by: userId,
            updated_at: new Date()
          }
        },
        { session }
      )

      if (updatedProject.matchedCount === 0) {
        throw new HttpException('Failed to update project', 400)
      }

      console.log(`✅ Project status updated to ${status}`)

      await this.emailQueue.addEmailJob({
        to: userId,
        subject: `Project Status Updated: ${status}`,
        templateName: 'project-status-update',
        context: {
          projectTitle: project.name,
          status,
          year: new Date().getFullYear(),
          start_url: process.env.CLIENT_URL
        }
      })
      console.log(`📧 Notification email sent to ${userId}`)

      await session.commitTransaction()
      console.log('✅ Transaction committed successfully')

      return { message: 'Project status updated successfully', project }
    })
  }

  async checkAvailableSlot(userId: string) {
    return runTransaction(async (session) => {
      const countSlot = await this.projectModel
        .countDocuments({
          status: 17,
          updated_by: userId,
          stage: 1
        })
        .session(session)

      const availableSlot = 5 - countSlot
      await session.commitTransaction()
      console.log('✅ Transaction committed successfully')

      return { message: 'Count available slot successfully', availableSlot }
    })
  }
}

export default new ProjectService()
