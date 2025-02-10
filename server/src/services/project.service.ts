import { FilterQuery, Model, UpdateQuery } from 'mongoose'
import ProjectModel, { IProject } from '@/models/project.model'

import { HttpException } from '@/shared/exceptions/http.exception'
import { runTransaction } from '@/helpers/transaction-helper'

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
        .session(session)
        .exec()

      if (!projects) {
        throw new HttpException('Error at getting projects', 400)
      }
      if (projects.length) {
        return projects[0] ?? []
      }
    })
  }
}

export default new ProjectService()
