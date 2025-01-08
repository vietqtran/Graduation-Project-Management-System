import AccountModel, { IAccount } from '@/models/account.model'
import { Model } from 'mongoose'
import { SignInDto } from '@/dtos/auth/sign-in.dto'
import { HttpException } from '@/shared/exceptions/http.exception'
import * as argon2 from 'argon2'
import UserModel, { IUser } from '@/models/user.model'
import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import { SignUpDto } from '@/dtos/auth/sign-up.dto'
import SessionModel, { ISession } from '@/models/session.model'
import { Inject, Service } from 'typedi'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

@Service()
export class AuthService {
  constructor(
    private readonly accountModel: Model<IAccount> = AccountModel,
    private readonly userModel: Model<IUser> = UserModel,
    private readonly sessionModel: Model<ISession> = SessionModel
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password, device, device_id } = signInDto
    const account = await this.accountModel.findOne({ email })
    if (!account) {
      throw new HttpException('Account not found', 400)
    }
    await this.verifyPassword(account.hashed_password, password)
    const user = await this.userModel.findOne({ _id: account.user_id })
    if (!user) {
      throw new HttpException('User not found', 400)
    }
    const payload: TokenPayload = {
      _id: user._id as string,
      email: account.email,
      roles: user.roles ?? [],
      username: user.username
    }
    const accessToken = this.signAccessToken(payload)
    const refreshToken = this.signRefreshToken(payload)
    const hashedAccessToken = await this.hashToken(accessToken)
    const hashedRefreshToken = await this.hashToken(refreshToken)

    const createdSesison = await this.sessionModel.create({
      device,
      device_id,
      hashed_access_token: hashedAccessToken,
      hashed_refresh_token: hashedRefreshToken,
      access_token_expires_at: new Date(Date.now() + 60 * 60 * 1000),
      refresh_token_expires_at: new Date(Date.now() + 60 * 60 * 1000 * 2)
    })

    if (!createdSesison) {
      throw new HttpException("Can't create session", 400)
    }

    const updatedAccount = await this.accountModel.updateOne(
      { _id: account._id },
      {
        $set: {
          sessions: [...account.sessions, { ...createdSesison }]
        }
      }
    )

    if (!updatedAccount) {
      throw new HttpException("Can't update account", 400)
    }

    return {
      user,
      accessToken,
      refreshToken
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, first_name, last_name, password, username, device, device_id } = signUpDto
    const isExistedUser = await this.userModel.findOne({
      $or: [{ username }, { email }]
    })
    if (isExistedUser) {
      throw new HttpException('Account already existed', 400)
    }
    const isExistedAccount = await this.accountModel.findOne({
      $or: [{ username }, { email }]
    })
    if (isExistedAccount) {
      throw new HttpException('User already existed', 400)
    }
    const hashedPassword = await this.hashPassword(password)
    const createdUser = await this.userModel.create({
      email,
      username,
      first_name,
      last_name
    })
    if (!createdUser) {
      throw new HttpException("Can't create user", 400)
    }

    const payload: TokenPayload = {
      _id: createdUser._id as string,
      email: createdUser.email,
      roles: createdUser.roles ?? [],
      username: createdUser.username
    }
    const accessToken = this.signAccessToken(payload)
    const refreshToken = this.signRefreshToken(payload)
    const hashedAccessToken = await this.hashToken(accessToken)
    const hashedRefreshToken = await this.hashToken(refreshToken)

    const createdSesison = await this.sessionModel.create({
      device,
      device_id,
      hashed_access_token: hashedAccessToken,
      hashed_refresh_token: hashedRefreshToken,
      access_token_expires_at: new Date(Date.now() + 60 * 60 * 1000),
      refresh_token_expires_at: new Date(Date.now() + 60 * 60 * 1000 * 2)
    })

    if (!createdSesison) {
      throw new HttpException("Can't create session", 400)
    }

    const createdAccount = await this.accountModel.create({
      user_id: createdUser._id,
      email,
      username,
      hashed_password: hashedPassword,
      sessions: [createdSesison._id]
    })

    if (!createdAccount) {
      throw new HttpException("Can't create account", 400)
    }

    return {
      user: createdUser,
      accessToken,
      refreshToken
    }
  }

  async logout() {}

  async refresh() {}

  async me() {}

  private async verifyPassword(hashedPassword: string, password: string) {
    try {
      return await argon2.verify(hashedPassword, password)
    } catch (err) {
      throw new HttpException('Password is not match', 401)
    }
  }

  private async hashPassword(password: string) {
    return await argon2.hash(password)
  }

  private async hashToken(token: string) {
    return await argon2.hash(token)
  }

  signAccessToken(data: TokenPayload) {
      try {
        return jwt.sign(
          {
            ...data
          },
          process.env.JWT_ACCESS_SECRET ?? '',
          { expiresIn: process.env.JWT_ACCESS_EXPIRE_AT ?? '' }
        )
      } catch (err) {
        throw new HttpException('Error while sign access token', 500)
      }
    }
  
    signRefreshToken(data: TokenPayload) {
      try {
        return jwt.sign(
          {
            ...data
          },
          process.env.JWT_REFRESH_SECRET ?? '',
          { expiresIn: process.env.JWT_REFRESH_EXPIRE_AT ?? '' }
        )
      } catch (err) {
        console.log(err)
        throw new HttpException('Error while sign refresh token', 500)
      }
    }
  
    verifyAccessToken(token: string) {
      try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? '')
      } catch (err) {
        console.log(err)
        throw new HttpException('Error while sign refresh token', 401)
      }
    }
  
    verifyRefreshToken(token: string) {
      try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? '')
      } catch (err) {
        console.log(err)
        throw new HttpException('Error while sign refresh token', 401)
      }
    }
}
