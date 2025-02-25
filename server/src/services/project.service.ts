import { FilterQuery, Model, UpdateQuery } from 'mongoose'
import ProjectModel, { IProject } from '@/models/project.model'

import { HttpException } from '@/shared/exceptions/http.exception'
import { runTransaction } from '@/helpers/transaction-helper'
import { StaffGetListProjectsDto } from '@/dtos/project/staff-manage-projects.dto'

export class ProjectService {
  private readonly projectModel: Model<IProject>

  constructor() {
    this.projectModel = ProjectModel
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
      const { name, major, field, campus, mark, category, status, stage, slow_count, noMembers, supervisor, page, limit, sort } = body;

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
      if (supervisor) filter.supervisor = { $in: [supervisor] }

      const projects = await this.projectModel
        .find(filter)
        .populate({ path: 'major', select: 'name' })
        .populate({ path: 'field', select: 'name' })
        .populate({ path: 'campus', select: 'name' })
        .populate({
          path: 'supervisor',
          select: '_id display_name'
        })
        .populate({
          path: 'members',
          select: '_id'
        })       
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('name major field campus mark category status stage slow_count members supervisor created_at updated_at')
        .lean()
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
        supervisor: project.supervisor
      }))

      return {
        list: formattedProjects,
        total: formattedProjects.length
      }
          
    })
  }
}

export default new ProjectService()
