import { GetDeadlinesDto, UpdateDeadlineDto } from '@/dtos/deadline/deadline.dto'
import { CreateParameterDto, DeleteParameterDto, UpdateParameterDto } from '@/dtos/deadline/parameter.dto'
import { asyncHandler } from '@/helpers/async-handler'
import { getUser } from '@/helpers/auth-helper'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { DeadlineService } from '@/services/deadline.service'
import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import { NextFunction, Request, Response } from 'express'

export class DeadlineController {
  private readonly deadlineService: DeadlineService
  constructor() {
    this.deadlineService = new DeadlineService()
  }

  getAllDeadlinesBySemester = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dto: GetDeadlinesDto = req.body
    const user = getUser(req)
    const deadlines = await this.deadlineService.getAllDeadlinesBySemester(dto, user)
    return ResponseHandler.sendSuccess(res, deadlines)
  })

  updateDeadline = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dto: UpdateDeadlineDto = req.body
    const user = getUser(req)
    const deadline = await this.deadlineService.updateDeadline(dto, user)
    return ResponseHandler.sendSuccess(res, deadline, 'Update deadline successfully')
  })

  getAllParameters = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parameters = await this.deadlineService.getAllParameters()
    return ResponseHandler.sendSuccess(res, parameters)
  })

  createParameter = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dto: CreateParameterDto = req.body
    const user = getUser(req)
    const parameter = await this.deadlineService.createParameter(dto, user)
    return ResponseHandler.sendSuccess(res, parameter, 'Create parameter successfully')
  })

  updateParameter = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dto: UpdateParameterDto = req.body
    const user = getUser(req)
    const parameter = await this.deadlineService.updateParameter(dto, user)
    return ResponseHandler.sendSuccess(res, parameter, 'Update parameter successfully')
  })

  deleteParameter = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dto: DeleteParameterDto = req.body
    await this.deadlineService.deleteParameter(dto)
    return ResponseHandler.sendSuccess(res, null, 'Delete parameter successfully')
  })
}
