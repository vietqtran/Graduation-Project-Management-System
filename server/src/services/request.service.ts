import * as dotenv from 'dotenv'

import RequestModel, { IRequest } from '@/models/request.model'
import UserModel, { IUser } from '@/models/user.model'
import mongoose, { Model } from 'mongoose'

import { RequestStatus } from '@/constants/request-status.enum'
import { UpdateRequestDto } from '@/dtos/request/update-request.dto'
import { runTransaction } from '@/helpers/transaction-helper'
import DeadlineModel from '@/models/deadline.model'
import { EmailQueue } from '@/queues/email.queue'
import { HttpException } from '@/shared/exceptions/http.exception'
import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import { MailService } from './mail.service'
import ProjectModel from '@/models/project.model'

dotenv.config()

export class RequestService {
  private readonly requestModel: Model<IRequest>
  private readonly userModel: Model<IUser>
  private readonly mailService: MailService
  private readonly emailQueue: EmailQueue

  constructor() {
    this.requestModel = RequestModel
    this.userModel = UserModel
    this.mailService = new MailService()
    this.emailQueue = new EmailQueue(this.mailService)
  }

  async createRequest(requestData: Omit<IRequest, '_id'>, tokenPayload: TokenPayload) {
  const toUser = await this.userModel.findOne({ email: { $eq: requestData.to_user } });

  if (!toUser) {
    throw new HttpException('User not found', 404);
  }

  return runTransaction(async (session) => {
    const request = await this.requestModel.create(
      [
        {
          to_user: toUser._id,
          from_user: tokenPayload._id,
          type: requestData.type,
          remark: requestData.remark || '',
          status: requestData.status || 'assigned',
          approve_user: requestData.approve_user,
          description: requestData.description,
          documents: requestData.documents,
          due_date: requestData.due_date || new Date(),
          created_at: requestData.created_at || new Date(),
          updated_at: requestData.updated_at || new Date(),
        },
      ],
      { session }
    );

    if (!request || request.length === 0) {
      throw new HttpException('Error at creating request', 400);
    }

    this.emailQueue.addEmailJob({
      to: toUser.email,
      subject: 'You have a new request from your supervisor',
      templateName: 'new-request',
      context: {
        year: new Date().getFullYear(),
        start_url: `${process.env.CLIENT_URL}/assign-requests`,
        request: {
          type: request[0].type,
          from_user: tokenPayload.username,
          description: request[0].description,
          remark: request[0].remark,
          due_date: request[0].due_date.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          }),
          status: request[0].status,
        },
      },
    });

    return {
      request: request[0],
      requestData: requestData,
    };
  });
}

  async updateRequest(requestId: string, userId: string, updateRequestDto: UpdateRequestDto) {
    return runTransaction(async (session) => {
      const request = await this.requestModel.findOne({ _id: requestId, from_user: userId }).session(session)

      if (!request) {
        throw new HttpException('Request not found', 404)
      }

      if (!updateRequestDto.approve_user || updateRequestDto.approve_user === '') {
        delete updateRequestDto.approve_user
      }

      if (updateRequestDto.to_user && typeof updateRequestDto.to_user === 'string') {
        const user = await this.userModel.findOne({ username: updateRequestDto.to_user })
        if (user) {
          updateRequestDto.to_user = user._id
        } else {
          throw new HttpException('User not found', 404)
        }
      }

      const allowedUpdates: Array<keyof UpdateRequestDto> = [
        'approve_user',
        'to_user',
        'type',
        'remark',
        'status',
        'description',
        'due_date'
      ]
      const sanitizedUpdate: Partial<Record<keyof UpdateRequestDto, any>> = {}
      allowedUpdates.forEach((field: keyof UpdateRequestDto) => {
        if (updateRequestDto[field] !== undefined) {
          sanitizedUpdate[field] = updateRequestDto[field]
        }
      })

      const updatedRequest = await this.requestModel.findByIdAndUpdate(
        requestId,
        { $set: sanitizedUpdate },
        { new: true, session }
      )

      if (!updatedRequest) {
        throw new HttpException("Can't update request", 500)
      }

      return updatedRequest
    })
  }

  async processRequest(requestId: string, adminId: string, status: RequestStatus, remark?: string) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const request = await this.requestModel.findById(requestId).session(session)

      if (!request) {
        throw new HttpException('Request not found', 404)
      }

      if (request.status !== RequestStatus.PENDING) {
        throw new HttpException('Request has already been processed', 400)
      }

      const updatedRequest = await this.requestModel.findByIdAndUpdate(
        requestId,
        {
          $set: {
            status,
            approve_user: adminId,
            remark
          }
        },
        { new: true, session }
      )

      if (!updatedRequest) {
        throw new HttpException("Can't process request", 500)
      }

      await session.commitTransaction()
      return updatedRequest
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async getRequestById(requestId: string) {
    return this.requestModel.findById(requestId).populate('from_user').populate('to_user').populate('approve_user')
  }
  async getUserRequests(userId: string) {
  return runTransaction(async (session) => {
    const requests = await this.requestModel
      .find({ from_user: userId })
      .populate('to_user')
      .populate('approve_user')
      .populate('documents')
      .sort({ created_at: -1 })
      .session(session)
      .lean()

    const requestsWithProject = await Promise.all(
      requests.map(async (request) => {
        let selectedProjectId = null

        if (request.to_user) {
          const project = await ProjectModel
            .findOne({ leader: request.to_user })  
            .select('_id')
            .lean()
            .session(session)

          if (project) {
            selectedProjectId = project._id.toString()
          }
        }

        return {
          _id: request._id?.toString(),
          to_user: (request.to_user as IUser)?.username || null,
          from_user: request.from_user || null,
          approve_user: request.approve_user || null,
          type: request.type || null,
          description: request.description || null,
          remark: request.remark || null,
          documents: request.documents || null,
          due_date: request.due_date ? new Date(request.due_date).toISOString() : null,
          status: request.status || null,
          created_at: request.created_at ? new Date(request.created_at).toISOString() : null,
          updated_at: request.updated_at ? new Date(request.updated_at).toISOString() : null,
          selectedProjectId // Trả về ID của project nếu to_user là leader
        }
      })
    )
    return requestsWithProject
  })
}


  async getAllRequests(tokenPayload: any) {
    const userId = tokenPayload._id // Lấy userId từ token
    if (!userId) {
      throw new Error('User ID not found in token')
    }

    return await this.requestModel.find({ from_user: userId }).populate('to_user').populate('approve_user')
  }

  async deleteRequest(requestId: string, tokenPayload: any) {
    return runTransaction(async (session) => {
      const request = await this.requestModel.findById(requestId).session(session)
      if (!request) {
        throw new HttpException('Request not found', 404)
      } else {
        await this.requestModel.findByIdAndDelete(requestId, { session })
        return { message: 'Request updated successfully' }
      }
    })
  }

  async getRequestsByUserId(to_user: string) {
    return runTransaction(async (session) => {
      const request = await this.requestModel.find({ to_user: to_user }).session(session)
      if (!request) {
        throw new HttpException('Request not found', 404)
      } else {
        return request
      }
    })
  }

  async getStudentRequests(studentId: string) {
    return runTransaction(async (session) => {
      const requests = await this.requestModel
        .find({ to_user: studentId })
        .populate('to_user')
        .populate('from_user')
        .populate('documents')
        .session(session)
      return requests ?? []
    })
  }

  async uploadDocument({ documentIds, requestId }: { documentIds: string[]; requestId: string }) {
    return runTransaction(async (session) => {
      const request = await this.requestModel.findById(requestId).session(session)
      if (!request) {
        throw new HttpException('Request not found', 404)
      } else {
        await this.requestModel.findByIdAndUpdate(
          requestId,
          { $push: { documents: { $each: documentIds } } },
          { session }
        )
        return { message: 'Request updated successfully' }
      }
    })
  }

  async submitRequest(requestId: string) {
    return runTransaction(async (session) => {
      const request = await this.requestModel.findById(requestId).session(session)
      if (!request) {
        throw new HttpException('Request not found', 404)
      } else {
        await this.requestModel.findByIdAndUpdate(requestId, { status: 'submitted' }, { session })
        return { message: 'Request summited' }
      }
    })
  }

  async checkEligibility(userId: string) {
    return runTransaction(async (session) => {
      const findProject = await ProjectModel.findOne({ members: userId }).session(session)
      if (!findProject) return false

      const leader = await UserModel.findById(findProject.leader).populate('planned_semester').session(session)
      if (!leader || !leader.planned_semester) return false

      const semester = leader.planned_semester

      const [totalRequests, completedCount, deadline] = await Promise.all([
        RequestModel.countDocuments({ to_user: userId }).session(session),
        RequestModel.countDocuments({ to_user: userId, status: 'completed' }).session(session),
        DeadlineModel.findOne({ deadline_key: 'thesis_defense', semester: semester }).session(session)
      ])

      console.log({ totalRequests, completedCount, deadline })

      if (totalRequests === 0) return false
      if (!deadline || !deadline.deadline_date) {
        throw new HttpException('Deadline not found', 404)
      }

      const currentDate = new Date()
      const deadlineDate = new Date(deadline.deadline_date)

      if (isNaN(deadlineDate.getTime())) {
        throw new Error('Invalid deadline date format!')
      }

      const currentTimestamp = currentDate.getTime()
      const deadlineTimestamp = deadlineDate.getTime()
      const completionRate = completedCount / totalRequests
      console.log('Current Date:', currentDate, typeof currentDate)
      console.log('Deadline Date:', deadlineDate, typeof deadlineDate)
      console.log('Completion Rate:', completionRate)
      return completionRate > 0.7 && currentTimestamp >= deadlineTimestamp
    })
  }
}
