import { NextFunction, Request, Response } from 'express'

import { CreateUserDto } from '@/dtos/user/create-user.dto'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { UserService } from '@/services/user.service'
import { asyncHandler } from '@/helpers/async-handler'

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
      ResponseHandler.sendSuccess(res, createdUser, 'User created successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  staffGetListStudents = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const students = await this.userService.staffGetListStudents(body)
    return ResponseHandler.sendSuccess(res, students)
  })

  staffGetListTeachers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const teachers = await this.userService.staffGetListTeachers(body)
    return ResponseHandler.sendSuccess(res, teachers)
  })
}
