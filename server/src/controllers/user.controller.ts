import { NextFunction, Request, Response } from 'express'

import { CreateUserDto } from '@/dtos/user/create-user.dto'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { UserService } from '@/services/user.service'
import { Service } from 'typedi'

@Service()
export class UserController {
  private readonly userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers()
      ResponseHandler.sendSuccess(res, users, 'Users retrieved successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
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
