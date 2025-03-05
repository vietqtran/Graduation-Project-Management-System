import { NextFunction, Request, Response } from 'express'
import { IdeaService } from '@/services/idea.service'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { asyncHandler } from '@/helpers/async-handler'

export class IdeaController {
  private readonly ideaService: IdeaService

  constructor() {
    this.ideaService = new IdeaService()
  }

  createIdea = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const ideaData = req.body
    // console.log('Received idea data:', ideaData);
    try {
      const newIdea = await this.ideaService.createIdea(ideaData) // Gọi service để tạo idea
      ResponseHandler.sendSuccess(res, newIdea) // Gửi phản hồi thành công
    } catch (error) {
      console.error('Error in createIdea controller:', error)
      next(error) // Nếu có lỗi, truyền lỗi tới middleware xử lý lỗi
    }
  })

  getIdeaStudent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIds = req.query.userIds as unknown as string
      const projects = await this.ideaService.getIdeaStudent(userIds.split(','))
      ResponseHandler.sendSuccess(res, projects)
    } catch (error) {
      console.error('Error in getIdeaStudent controller:', error)
      next(error)
    }
  })
  deleteIdea = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.query.projectId as string
      const userId = req.query.userId as string
      await this.ideaService.deleteIdea(projectId, userId)
      ResponseHandler.sendSuccess(res, null, 'Idea deleted successfully')
    } catch (error) {
      console.error('Error in deleteIdea controller:', error)
      next(error)
    }
  })
  changeIdea = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.query.projectId as string
      const userId = req.query.userId as string
      const updateData = req.body
      await this.ideaService.changeIdea(projectId,updateData, userId)
      ResponseHandler.sendSuccess(res, null, 'Idea Changed successfully')
    } catch (error) {
      console.error('Error in deleteIdea controller:', error)
      next(error)
    }
  })
}
