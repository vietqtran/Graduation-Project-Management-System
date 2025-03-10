import { Request, Response, NextFunction } from 'express'
import { SupervisorService } from '../services/supervisor.service'
import { ResponseHandler } from '../middlewares/response-handler.middleware'
import { asyncHandler } from '@/helpers/async-handler'

export class SupervisorController {
  private readonly supervisorService: SupervisorService

  constructor() {
    this.supervisorService = new SupervisorService()
  }

  getAllSupervisors = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const supervisors = await this.supervisorService.getAllSupervisors()
      ResponseHandler.sendSuccess(res, supervisors)
    } catch (error) {
      next(error)
    }
  })
}
