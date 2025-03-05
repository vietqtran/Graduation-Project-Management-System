import * as dotenv from 'dotenv'
import mongoose, { Model } from 'mongoose'

import RequestModel, { IRequest } from '@/models/request.model'
import UserModel, { IUser } from '@/models/user.model'
import { HttpException } from '@/shared/exceptions/http.exception'
import { CreateRequestDto } from '@/dtos/request/create-request.dto'
import { UpdateRequestDto } from '@/dtos/request/update-request.dto'
import { RequestStatus } from '@/constants/request-status.enum'
import { EmailQueue } from '@/queues/email.queue'
import { MailService } from './mail.service'
import { runTransaction } from '@/helpers/transaction-helper'
import { IUploadDocument } from '@/models/document.model'

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

  async createRequest(requestData: Omit<IRequest, '_id' | 'approve_user' | 'status' | 'created_at' | 'updated_at'>) {
    return runTransaction(async (session) => {
      // Tạo request với giá trị mặc định
      const request = await this.requestModel.create(
        [
          {
            to_user: requestData.to_user, // Bắt buộc
            from_user: requestData.from_user, // Bắt buộc
            type: requestData.type, // Bắt buộc
            remark: requestData.remark || '', // Có thể trống
            status: 'pending', // Mặc định là 'pending'
            approve_user: null, // Chưa có người duyệt
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        { session }
      )

      if (!request) {
        throw new HttpException('Error at creating request', 400)
      }

      return request
    })
  }

  async updateRequest(requestId: string, userId: string, updateRequestDto: UpdateRequestDto) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const request = await this.requestModel.findOne({ _id: requestId, from_user: userId }).session(session)

      if (!request) {
        throw new HttpException('Request not found', 404)
      }

      if (request.status !== RequestStatus.PENDING) {
        throw new HttpException('Cannot update processed request', 400)
      }

      const updatedRequest = await this.requestModel.findByIdAndUpdate(
        requestId,
        {
          $set: {
            ...updateRequestDto
          }
        },
        { new: true, session }
      )

      if (!updatedRequest) {
        throw new HttpException("Can't update request", 500)
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
    const requests = await this.requestModel
      .find({ from_user: userId })
      .populate('from_user') // Lấy toàn bộ thông tin của from_user
      .populate('to_user') // Lấy toàn bộ thông tin của to_user
      .populate('approve_user') // Lấy toàn bộ thông tin của approve_user
      .lean() // Trả về object thuần, giúp dễ dàng format dữ liệu

    return requests.map((request) => ({
      _id: request._id?.toString() || null, // Chuyển _id thành string
      to_user: request.to_user || null,
      from_user: request.from_user || null,
      approve_user: request.approve_user || null,
      type: request.type || null,
      remark: request.remark || null,
      due_date: request.due_date ? new Date(request.due_date).toISOString() : null,
      created_at: request.createdAt ? new Date(request.createdAt).toISOString() : null,
      updated_at: request.updatedAt ? new Date(request.updatedAt).toISOString() : null,
      status: request.status || null
    }))
  }

  async getAllRequests(tokenPayload: any) {
    const userId = tokenPayload._id // Lấy userId từ token

    if (!userId) {
      throw new Error('User ID not found in token')
    }

    return this.requestModel
      .find({ from_user: userId }) // ✅ Lọc theo from_user
      .populate('from_user')
      .populate('to_user')
      .populate('approve_user')
  }

  async deleteRequest(requestId: string, userId: string) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const request = await this.requestModel.findOne({ _id: requestId, from_user: userId }).session(session)

      if (!request) {
        throw new HttpException('Request not found', 404)
      }

      if (request.status !== RequestStatus.PENDING) {
        throw new HttpException('Cannot delete processed request', 400)
      }

      await this.requestModel.findByIdAndDelete(requestId).session(session)

      await session.commitTransaction()
      return null
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
}
