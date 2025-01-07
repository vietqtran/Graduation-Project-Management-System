import { Model } from 'mongoose'
import UserModel, { IUser } from '@/models/user.model'
import { CreateUserDto } from '@/dtos/user/create-user.dto'
import * as bcrypt from 'bcrypt'
import { HttpException } from '@/shared/exceptions/http.exception'

export class UserService {
  constructor(private readonly userModel: Model<IUser> = UserModel) {}

  async createUser(createUserDto: CreateUserDto) {
    const session = await this.userModel.startSession()
    session.startTransaction()

    try {
      const isExisted = await this.userModel
        .findOne({
          $or: [{ email: createUserDto.email }, { username: createUserDto.username }]
        })
        .session(session)

      if (isExisted) {
        throw new HttpException('User already exists.', 400)
      }

      const hashed_password = await this.hashPassword(createUserDto.password)

      const createdUser = await this.userModel.create(
        [
          {
            ...createUserDto,
            hashed_password
          }
        ],
        { session }
      )

      if (!createdUser) {
        throw new HttpException('Error at creating user', 400)
      }

      await session.commitTransaction()
      return createdUser
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
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
