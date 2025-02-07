import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/helpers/async-handler';
import RequestModel from '@/models/request.model';
import { ResponseHandler } from '@/middlewares/response-handler.middleware';

export class RequestController {
  getAllRequests = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const requests = await RequestModel.find().populate('to_user from_user approve_user');
    return ResponseHandler.sendSuccess(res, requests);
  });
}
