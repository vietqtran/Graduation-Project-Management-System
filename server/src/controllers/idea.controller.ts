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
}
