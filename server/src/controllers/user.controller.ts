// controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express'
import { UserService } from '@/services/user.service'
import { CreateUserDto } from '@/dtos/user/create-user.dto'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const createUserDto: CreateUserDto = req.body
      const createdUser = await this.userService.createUser(createUserDto)
      ResponseHandler.sendSuccess(res, createdUser, 'Users retrieved successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }
}
