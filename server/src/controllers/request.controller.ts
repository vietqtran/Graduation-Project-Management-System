import { NextFunction, Request, Response } from 'express'

import { ApproveRequestDto } from '@/dtos/request/approve-request.dto'
import { DenyRequestDto } from '@/dtos/request/deny-request.dto'
import { HttpException } from '@/shared/exceptions/http.exception'
import { RequestService } from '@/services/request.service'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { asyncHandler } from '@/helpers/async-handler'
import { getUser } from '@/helpers/auth-helper'

export class RequestController {
  private readonly requestService: RequestService

  constructor() {
    this.requestService = new RequestService()
  }

  getAllRequests = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenPayload = getUser(req)
      const userId = tokenPayload._id

      const requests = await this.requestService.getUserRequests(userId) 
      ResponseHandler.sendSuccess(res, requests, 'Get all requests successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  })

  approveRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const approveRequestDto: ApproveRequestDto = req.body
    const request = await this.requestService.updateRequest(id, 'approved', approveRequestDto)

    if (!request) {
      throw new HttpException('Request not found', 404)
    }

    ResponseHandler.sendSuccess(res, request, 'Request approved successfully')
  })

  denyRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const denyRequestDto: DenyRequestDto = req.body
    const request = await this.requestService.updateRequest(id, 'rejected', denyRequestDto)

    if (!request) {
      throw new HttpException('Request not found', 404)
    }

    ResponseHandler.sendSuccess(res, request, 'Request denied successfully')
  })

  createRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const requestData = req.body
    const tokenPayload = getUser(req)
    const request = await this.requestService.createRequest(requestData, tokenPayload)
    ResponseHandler.sendSuccess(res, request, 'Create request successfully')
  })

  deleteRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const tokenPayload = getUser(req)
    await this.requestService.deleteRequest(id, tokenPayload._id)
    ResponseHandler.sendSuccess(res, null, 'Delete request successfully')
  })

  getRequestById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const request = await this.requestService.getRequestById(id)
    ResponseHandler.sendSuccess(res, request)
  })

  getRequestsByUserId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const requests = await this.requestService.getRequestsByUserId(userId)
    ResponseHandler.sendSuccess(res, requests)
  })

  updateRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.params
    const tokenPayload = getUser(req)
    const updateRequestDto = req.body
    const request = await this.requestService.updateRequest(requestId, tokenPayload._id, updateRequestDto)
    ResponseHandler.sendSuccess(res, request, 'Update request successfully')
  })

  getStudentRequests = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const tokenPayload = getUser(req)
    const requests = await this.requestService.getStudentRequests(tokenPayload._id)
    ResponseHandler.sendSuccess(res, requests)
  })

  uploadDocument = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const requestData = req.body
    const document = await this.requestService.uploadDocument(requestData)
    ResponseHandler.sendSuccess(res, document, 'Upload document successfully')
  })

  submitRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const requestData = req.body
    const request = await this.requestService.submitRequest(requestData.id)
    ResponseHandler.sendSuccess(res, request, 'Submit request successfully')
  })

  checkEligibility = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const tokenPayload = getUser(req)
    const userId = tokenPayload._id
    const isEligible = await this.requestService.checkEligibility(userId)
    ResponseHandler.sendSuccess(res, isEligible)
  })
}
