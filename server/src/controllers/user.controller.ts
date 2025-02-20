import { NextFunction, Request, Response } from 'express'

import { CreateUserDto } from '@/dtos/user/create-user.dto'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { UserService } from '@/services/user.service'
import { asyncHandler } from '@/helpers/async-handler'
import { getUser } from '@/helpers/auth-helper'

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

  staffGetDetailStudent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const student = await this.userService.staffGetDetailStudent(body)
    return ResponseHandler.sendSuccess(res, student)
  })

  staffUpdateStudent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const tokenPayload = getUser(req);
    await this.userService.staffUpdateStudent(body, tokenPayload)
    return ResponseHandler.sendSuccess(res, null, 'Student updated successfully')
  })

  staffGetListTeachers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const teachers = await this.userService.staffGetListTeachers(body)
    return ResponseHandler.sendSuccess(res, teachers)
  })

  staffGetDetailTeacher = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const teacher = await this.userService.staffGetDetailTeacher(body)
    return ResponseHandler.sendSuccess(res, teacher)
  })

  staffUpdateTeacher = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const tokenPayload = getUser(req);
    await this.userService.staffUpdateTeacher(body, tokenPayload)
    return ResponseHandler.sendSuccess(res, null, 'Teacher updated successfully')
  })
}
