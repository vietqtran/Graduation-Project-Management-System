import { FilterQuery, Model, UpdateQuery } from 'mongoose'
import ProjectModel, { IProject } from '@/models/project.model'

import { HttpException } from '@/shared/exceptions/http.exception'
import { runTransaction } from '@/helpers/transaction-helper'
import {
  StaffGetDetailProjectDto,
  staffGetListAvailableStudentsDto,
  staffGetListAvailableSupervisorsDto,
  StaffGetListProjectsDto,
  StaffUpdateProjectDto
} from '@/dtos/project/staff-manage-projects.dto'
import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import { create } from 'domain'
import { deserialize } from 'v8'
import { getCurrentSemester, getSemesterDates, getSemesterFromDate } from '@/helpers/date-helper'
import UserModel, { IUser } from '@/models/user.model'
import ParameterModel, { IParameter } from '@/models/parameter.model'
import { convertType } from '@/helpers/convert-type-helper'
import { USER_STATUS } from '@/constants/status'

export class ProjectService {
  private readonly projectModel: Model<IProject>
  private readonly userModel: Model<IUser>
  private readonly parameterModel: Model<IParameter>

  constructor() {
    this.projectModel = ProjectModel
    this.userModel = UserModel
    this.parameterModel = ParameterModel
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
    const { search = '' } = body
    const currentSemester = getCurrentSemester()
    return runTransaction(async (session) => {
      const students = await this.userModel
        .find({
          roles: 'student',
          planned_semester: currentSemester,
          status: USER_STATUS.UN_GROUPED,
          $or: [{ display_name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
        })
        .select('display_name username email avatar')
        .session(session)

      return students
    })
  }

  async staffGetListAvailableSupervisors(body: staffGetListAvailableSupervisorsDto) {
    const { search = '' } = body
    return runTransaction(async (session) => {
      const supervisors = await this.userModel
        .find({
          roles: 'supervisor',
          status: USER_STATUS.AVAILABLE,
          $or: [{ display_name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
        })
        .select('display_name username email avatar')
        .session(session)

      return supervisors
    })
  }
}

export default new ProjectService()
