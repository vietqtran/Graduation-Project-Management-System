import { Request, Response, NextFunction } from 'express';
import { RequestService } from '@/services/request.service';
import { HttpException } from '@/shared/exceptions/http.exception';
import { ResponseHandler } from '@/middlewares/response-handler.middleware';
import { ApproveRequestDto } from '@/dtos/request/approve-request.dto';
import { DenyRequestDto } from '@/dtos/request/deny-request.dto';

export class RequestController {
  private readonly requestService: RequestService;

  constructor() {
    this.requestService = new RequestService();
  }

  async getAllRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await this.requestService.getAllRequests();
      ResponseHandler.sendSuccess(res, requests, 'Get all requests successfully');
    } catch (error) {
      ResponseHandler.sendError(res, error);
      next(error);
    }
  }

  async approveRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const approveRequestDto: ApproveRequestDto = req.body;
      const request = await this.requestService.updateRequest(id, 'approved', approveRequestDto);
      if (!request) {
        throw new HttpException('Request not found', 404);
      }
      ResponseHandler.sendSuccess(res, request, 'Request approved successfully');
    } catch (error) {
      ResponseHandler.sendError(res, error);
      next(error);
    }
  }

  async denyRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const denyRequestDto: DenyRequestDto = req.body;
      const request = await this.requestService.updateRequest(id, 'rejected', denyRequestDto);
      if (!request) {
        throw new HttpException('Request not found', 404);
      }
      ResponseHandler.sendSuccess(res, request, 'Request denied successfully');
    } catch (error) {
      ResponseHandler.sendError(res, error);
      next(error);
    }
  }
}