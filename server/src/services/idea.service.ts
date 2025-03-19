import { FilterQuery, Model, UpdateQuery } from 'mongoose'
import ProjectModel, { IProject } from '@/models/project.model'
import UserModel, { IUser } from '@/models/user.model'
import { CreateIdeaDto, UpdateIdeaDto } from '@/dtos/idea/create-idea.dto'

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
    const user = await this.userModel.findById(ideaData.leader)
    if (!user?.roles?.includes('student')) {
      throw new HttpException('This action is only available for students', 404)
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
    return runTransaction(async (session) => {
      const project = await this.projectModel.findOne({ _id: projectId }).session(session).exec()
      if (project?.leader?.valueOf() !== userId) {
        throw new HttpException('You are not the leader of this idea', 400)
      }
      await this.projectModel.deleteOne({ _id: projectId }).session(session).exec()
      if (project.members && project.members.length > 0) {
        await this.userModel
          .updateMany(
            { _id: { $in: (project.members as IUser[]).map((member: IUser) => member._id) } },
            { $set: { status: USER_STATUS.UN_GROUPED } },
            { session }
          )
          .exec()
      }
    })
  }
  async changeIdea(projectId: string, updateIdea: UpdateIdeaDto, userId: string): Promise<IProject> {
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
  
}

