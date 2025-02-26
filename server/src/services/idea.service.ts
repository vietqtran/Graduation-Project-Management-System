import { FilterQuery, Model, UpdateQuery } from 'mongoose'
import ProjectModel, { IProject } from '@/models/project.model'
import { CreateIdeaDto } from '@/dtos/idea/create-idea.dto'

import { HttpException } from '@/shared/exceptions/http.exception'
import { runTransaction } from '@/helpers/transaction-helper'

export class IdeaService {
  private readonly IdeaService: Model<IProject>

  constructor() {
    this.IdeaService = ProjectModel
  }

  async createIdea(ideaData: CreateIdeaDto): Promise<IProject> {
    // Kiểm tra các trường bắt buộc trong một lần
    const requiredFields: (keyof CreateIdeaDto)[] = ['name', 'campus', 'leader', 'members', 'field', 'major']
    const missingFields = requiredFields.filter((field) => !ideaData[field])

    if (missingFields.length > 0) {
      throw new HttpException(`${missingFields.join(', ')} are required`, 400)
    }

    const existingIdea = await this.IdeaService.findOne({
      members: { $in: [ideaData.leader] } // Kiểm tra xem userId có nằm trong mảng members không
    })

    if (existingIdea) {
      throw new HttpException(
        'You are already part of an existing idea. Please leave it before creating a new one.',
        400
      )
    }

    return runTransaction(async (session) => {
      const idea = new this.IdeaService({
        ...ideaData,
        histories: [],
        tasks: [],
        slow_count: 0,
        supervisor: null,
        category: 1
      })

      await idea.save({ session })

      return idea
    })
  }
}
