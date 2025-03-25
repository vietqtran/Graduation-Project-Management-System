import * as dotenv from 'dotenv'
import mongoose, { Model } from 'mongoose'

import RequestModel, { IRequest } from '@/models/request.model'
import UserModel, { IUser } from '@/models/user.model'
import { HttpException } from '@/shared/exceptions/http.exception'
import { CreateRequestDto } from '@/dtos/request/create-request.dto'
import { UpdateRequestDto } from '@/dtos/request/update-request.dto'
import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import { RequestStatus } from '@/constants/request-status.enum'
import { EmailQueue } from '@/queues/email.queue'
import { MailService } from './mail.service'
import { runTransaction } from '@/helpers/transaction-helper'
import { IUploadDocument } from '@/models/document.model'
import { session } from 'passport'
import { create } from 'domain'

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
    const toUser = await this.userModel.findOne({ email: { $eq: requestData.to_user } })

    if (!toUser) {
      throw new HttpException('User not found', 404)
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
            updated_at: requestData.updated_at || new Date()
          }
        ],
        { session }
      )

      if (!request || request.length === 0) {
        throw new HttpException('Error at creating request', 400)
      }

      return {
        request: request[0],
        requestData: requestData
      }
    })
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
        .session(session)
        .lean()

      return requests.map((request) => ({
        _id: request._id?.toString(),
        to_user: (request.to_user as IUser)?.username || null,
        from_user: request.from_user || null,
        approve_user: request.approve_user || null,
        type: request.type || null,
        description: request.description || null,
        remark: request.remark || null,
        due_date: request.due_date ? new Date(request.due_date).toISOString() : null,
        status: request.status || null,
        created_at: request.created_at ? new Date(request.created_at).toISOString() : null,
        updated_at: request.updated_at ? new Date(request.updated_at).toISOString() : null
      }))
    })
  }

  async getAllRequests(tokenPayload: any) {
    const userId = tokenPayload._id // Lấy userId từ token

    if (!userId) {
      throw new Error('User ID not found in token')
    }

    return this.requestModel.find({ from_user: userId }).populate('to_user').populate('approve_user')
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
}
