import { FilterQuery, Model, UpdateQuery } from 'mongoose'
import ProjectModel, { IProject } from '@/models/project.model'
import UserModel, { IUser } from '@/models/user.model'  
import { CreateIdeaDto } from '@/dtos/idea/create-idea.dto'

import { HttpException } from '@/shared/exceptions/http.exception'
import { runTransaction } from '@/helpers/transaction-helper'
import { USER_STATUS } from '@/constants/status'

export class IdeaService {
  private readonly projectModel: Model<IProject>
  private readonly userModel: Model<IUser>

  constructor() {
    this.projectModel = ProjectModel
    this.userModel = UserModel
  }

  async createIdea(ideaData: CreateIdeaDto): Promise<IProject> {
    // Kiểm tra các trường bắt buộc trong một lần
    const requiredFields: (keyof CreateIdeaDto)[] = ['name', 'campus', 'leader', 'members', 'field', 'major']
    const missingFields = requiredFields.filter((field) => !ideaData[field])

    if (missingFields.length > 0) {
      throw new HttpException(`${missingFields.join(', ')} are required`, 400)
    }

    const existingIdea = await this.projectModel.findOne({
      members: { $in: [ideaData.leader] } // Kiểm tra xem userId có nằm trong mảng members không
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
        category: 1
      })

      await idea.save({ session })
      await this.userModel.updateOne(
        { _id: ideaData.leader },
        { $set: { status: USER_STATUS.ACTIVATED } },
        { session }
      )
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
  async deleteIdea(projectId: string) {
    return runTransaction(async (session) => {
      await this.projectModel.deleteOne({ _id: projectId }).session(session).exec()
    })
  }
}
