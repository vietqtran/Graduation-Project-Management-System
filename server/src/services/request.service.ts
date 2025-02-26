import * as dotenv from 'dotenv';
import mongoose, { Model } from 'mongoose';

import RequestModel, { IRequest } from '@/models/request.model';
import UserModel, { IUser } from '@/models/user.model';
import { HttpException } from '@/shared/exceptions/http.exception';
import { CreateRequestDto } from '@/dtos/request/create-request.dto';
import { UpdateRequestDto } from '@/dtos/request/update-request.dto';
import { RequestStatus } from '@/constants/request-status.enum';
import { EmailQueue } from '@/queues/email.queue';
import { MailService } from './mail.service';

dotenv.config();

export class RequestService {
  private readonly requestModel: Model<IRequest>;
  private readonly userModel: Model<IUser>;
  private readonly mailService: MailService;
  private readonly emailQueue: EmailQueue;

  constructor() {
    this.requestModel = RequestModel;
    this.userModel = UserModel;
    this.mailService = new MailService();
    this.emailQueue = new EmailQueue(this.mailService);
  }

  async createRequest(userId: string, createRequestDto: CreateRequestDto) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findById(userId).session(session);
      if (!user) {
        throw new HttpException('User not found', 404);
      }

      const { to_user, type, remark } = createRequestDto;

      const createdRequest = await this.requestModel.create([
        {
          from_user: userId,
          to_user,
          type,
          status: RequestStatus.PENDING,
          remark,
        },
      ], { session });

      if (!createdRequest[0]) {
        throw new HttpException("Can't create request", 500);
      }

      await session.commitTransaction();

      return createdRequest[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateRequest(requestId: string, userId: string, updateRequestDto: UpdateRequestDto) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const request = await this.requestModel.findOne({ _id: requestId, from_user: userId }).session(session);

      if (!request) {
        throw new HttpException('Request not found', 404);
      }

      if (request.status !== RequestStatus.PENDING) {
        throw new HttpException('Cannot update processed request', 400);
      }

      const updatedRequest = await this.requestModel.findByIdAndUpdate(
        requestId,
        {
          $set: {
            ...updateRequestDto,
          },
        },
        { new: true, session }
      );

      if (!updatedRequest) {
        throw new HttpException("Can't update request", 500);
      }

      await session.commitTransaction();
      return updatedRequest;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async processRequest(requestId: string, adminId: string, status: RequestStatus, remark?: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const request = await this.requestModel.findById(requestId).session(session);

      if (!request) {
        throw new HttpException('Request not found', 404);
      }

      if (request.status !== RequestStatus.PENDING) {
        throw new HttpException('Request has already been processed', 400);
      }

      const updatedRequest = await this.requestModel.findByIdAndUpdate(
        requestId,
        {
          $set: {
            status,
            approve_user: adminId,
            remark,
          },
        },
        { new: true, session }
      );

      if (!updatedRequest) {
        throw new HttpException("Can't process request", 500);
      }

      await session.commitTransaction();
      return updatedRequest;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getRequestById(requestId: string) {
    return this.requestModel.findById(requestId).populate('from_user').populate('to_user').populate('approve_user');
  }

  async getUserRequests(userId: string) {
    return this.requestModel.find({ from_user: userId }).populate('from_user').populate('to_user').populate('approve_user');
  }

  async getAllRequests(status?: RequestStatus) {
    const query = status ? { status } : {};
    return this.requestModel.find(query).populate('from_user').populate('to_user').populate('approve_user');
  }

  async deleteRequest(requestId: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const request = await this.requestModel.findOne({ _id: requestId, from_user: userId }).session(session);

      if (!request) {
        throw new HttpException('Request not found', 404);
      }

      if (request.status !== RequestStatus.PENDING) {
        throw new HttpException('Cannot delete processed request', 400);
      }

      await this.requestModel.findByIdAndDelete(requestId).session(session);

      await session.commitTransaction();
      return null;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
