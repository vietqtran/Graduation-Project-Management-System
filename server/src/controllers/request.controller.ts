import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/helpers/async-handler';
import RequestModel from '@/models/request.model';
import { ResponseHandler } from '@/middlewares/response-handler.middleware';

export class RequestController {
  getAllRequests = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const requests = await RequestModel.find().populate('to_user from_user approve_user');
    return ResponseHandler.sendSuccess(res, requests);
  });

  approveRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const request = await RequestModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    ).populate('to_user from_user approve_user');
    if (!request) {
      return ResponseHandler.sendError(res, 'Request not found');
    }
    return ResponseHandler.sendSuccess(res, request);
  });

  denyRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const request = await RequestModel.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    ).populate('to_user from_user approve_user');
    if (!request) {
      return ResponseHandler.sendError(res, 'Request not found');
    }
    return ResponseHandler.sendSuccess(res, request);
  });
}
