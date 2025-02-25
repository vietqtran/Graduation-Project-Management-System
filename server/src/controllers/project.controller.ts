import { NextFunction, Request, Response } from 'express'

import { ProjectService } from '@/services/project.service'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { asyncHandler } from '@/helpers/async-handler'

export class ProjectController {
  private readonly projectService: ProjectService

  constructor() {
    this.projectService = new ProjectService()
  }

  getProjectByUserId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIds = (req.query.userIds as unknown as string).split(',')
      const project = await this.projectService.getByUserIds(userIds)
      ResponseHandler.sendSuccess(res, project, 'Get project information successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  })
}
