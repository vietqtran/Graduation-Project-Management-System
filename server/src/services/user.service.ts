import * as bcrypt from 'bcrypt'

import UserModel, { IUser } from '@/models/user.model'

import { CreateUserDto } from '@/dtos/user/create-user.dto'
import { HttpException } from '@/shared/exceptions/http.exception'
import { Model } from 'mongoose'

export class UserService {
  private readonly userModel: Model<IUser>
  constructor() {
    this.userModel = UserModel
  }

  async getAllUsers() {
    return await this.userModel.find()
  }

  async createUser(createUserDto: CreateUserDto) {
    const isExisted = await this.userModel.findOne({
      $or: [{ email: createUserDto.email }, { username: createUserDto.username }]
    })

    if (isExisted) {
      throw new HttpException('User already exists.', 400)
    }

    const hashed_password = await this.hashPassword(createUserDto.password)
    if (!hashed_password) {
      throw new HttpException('Error hashing password', 500)
    }

    const createdUser = await this.userModel.create({
      ...createUserDto,
      hashed_password
    })

    if (!createdUser) {
      throw new HttpException('Error at creating user', 400)
    }

    return createdUser
  }

  private async hashPassword(password: string) {
    try {
      return await bcrypt.hash(password, 10)
    } catch (err) {
      console.error('Error while hash password.', err)
      return null
    }
  }
}
