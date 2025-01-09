import * as argon2 from 'argon2'
import * as dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken'

import AccountModel, { IAccount } from '@/models/account.model'
import SessionModel, { ISession } from '@/models/session.model'
import UserModel, { IUser } from '@/models/user.model'

import { HttpException } from '@/shared/exceptions/http.exception'
import { Model } from 'mongoose'
import { SignInDto } from '@/dtos/auth/sign-in.dto'
import { SignUpDto } from '@/dtos/auth/sign-up.dto'
import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server'
import { AuthenticatorTransportFuture, RegistrationResponseJSON } from '@simplewebauthn/types'
import { VerifyRegistrationPasskeyDto } from '@/dtos/auth/verify-registration-passkey.dto'

dotenv.config()

export class AuthService {
  private readonly accountModel: Model<IAccount>
  private readonly userModel: Model<IUser>
  private readonly sessionModel: Model<ISession>
  constructor() {
    this.accountModel = AccountModel
    this.userModel = UserModel
    this.sessionModel = SessionModel
  }

  // Sign in method
  async signIn(signInDto: SignInDto) {
    // Sử dụng destructuring nếu có thể để tránh code nhìn rối mắt (nếu không dùng thì sẽ phải dùng signInDto.email,...)
    const { email, password, device, device_id } = signInDto
    // Tìm trong database có tồn tại email này trong acocunt nào không
    const account = await this.accountModel.findOne({ email })
    // Nếu không có trả về lỗi 404
    if (!account) {
      throw new HttpException('Account not found', 404)
    }
    // Nếu tồn tại email thì sẽ kiểm tra password được hash trong database (ở đây đã bắt lỗi sẵn rồi nên không cần check lại)
    await this.verifyPassword(account.hashed_password, password)
    // Tìm trong database có user nào đã có email này không
    const user = await this.userModel.findOne({ _id: account.user_id })
    // Nếu không thì lỗi 404
    if (!user) {
      throw new HttpException('User not found', 404)
    }
    // Nếu có thì khởi tạo payload để đăng ký token bao gồm các thông tin như dưới
    const payload: TokenPayload = {
      _id: user._id as string,
      email: account.email,
      roles: user.roles ?? [],
      username: user.username,
      device_id
    }
    // Generate token
    const accessToken = this.signAccessToken(payload)
    const refreshToken = this.signRefreshToken(payload)

    // Khi mà sign in, trong trường hợp đã đăng nhập trước đó thì sẽ có device_id
    // Khi này sẽ dung upsert
    // (nếu không có device_id tức là chưa từng đăng nhập => tạo mới session, còn không thì update session có device_id tương tự)
    const upsertSession = await this.sessionModel.updateOne(
      { device_id },
      {
        $set: {
          device,
          device_id,
          access_token: accessToken,
          refresh_token: refreshToken,
          access_token_expires_at: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRE_AT)),
          refresh_token_expires_at: new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRE_AT))
        }
      },
      { upsert: true }
    )

    // Nếu update lỗi
    if (!upsertSession) {
      throw new HttpException("Can't create session", 500)
    }

    // Trong trường hợp session được update
    if (upsertSession.upsertedId) {
      const updatedAccount = await this.accountModel.updateOne(
        { _id: account._id },
        {
          $set: {
            sessions: [...account.sessions, upsertSession.upsertedId]
          }
        }
      )
      if (!updatedAccount) {
        throw new HttpException("Can't update account", 500)
      }
    }

    return {
      user,
      accessToken,
      refreshToken,
      deviceId: device_id
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
      throw new HttpException("Can't create user", 500)
    }

    const payload: TokenPayload = {
      _id: createdUser._id as string,
      email: createdUser.email,
      roles: createdUser.roles ?? [],
      username: createdUser.username,
      device_id
    }
    const accessToken = this.signAccessToken(payload)
    const refreshToken = this.signRefreshToken(payload)

    const createdSession = await this.sessionModel.create({
      device,
      device_id,
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_at: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRE_AT)),
      refresh_token_expires_at: new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRE_AT))
    })

    if (!createdSession) {
      throw new HttpException("Can't create session", 500)
    }

    const createdAccount = await this.accountModel.create({
      user_id: createdUser._id,
      email,
      username,
      hashed_password: hashedPassword,
      sessions: [createdSession._id]
    })

    if (!createdAccount) {
      throw new HttpException("Can't create account", 500)
    }

    return {
      user: createdUser,
      accessToken,
      refreshToken,
      deviceId: device_id
    }
  }

  async logout(accessToken: string) {
    const decoded = this.verifyAccessToken(accessToken) as TokenPayload
    const session = await this.sessionModel.findOne({
      device_id: decoded.device_id
    })
    if (!session) {
      throw new HttpException('Session not found', 404)
    }
    const deletedSession = await this.sessionModel.deleteOne({
      _id: session._id
    })
    if (!deletedSession) {
      throw new HttpException('Error at delete session', 500)
    }
    const account = await this.accountModel.findOne({ user_id: decoded._id })
    if (!account) {
      throw new HttpException('Account not found', 404)
    }
    const updatedAccount = await this.accountModel.updateOne(
      { _id: account?._id },
      {
        $set: {
          sessions: account?.sessions.filter((s: any) => {
            return !s.equals(session._id)
          })
        }
      }
    )
    if (!updatedAccount) {
      throw new HttpException('Error at update account', 500)
    }
    return null
  }

  async refresh(token: string) {
    const decoded = this.verifyRefreshToken(token) as TokenPayload
    const user = await this.userModel.findOne({ _id: decoded._id })
    if (!user) {
      throw new HttpException('User not found', 404)
    }
    const session = await this.sessionModel.findOne({
      device_id: decoded.device_id
    })
    if (!session) {
      throw new HttpException('Session not found', 404)
    }
    const payload: TokenPayload = {
      _id: user._id as string,
      email: user.email,
      roles: user.roles ?? [],
      username: user.username,
      device_id: decoded.device_id
    }
    const accessToken = this.signAccessToken(payload)
    const refreshToken = this.signRefreshToken(payload)
    const updatedSession = await this.sessionModel.updateOne(
      { _id: session._id },
      {
        $set: {
          access_token: accessToken,
          refresh_token: refreshToken,
          access_token_expires_at: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRE_AT)),
          refresh_token_expires_at: new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRE_AT))
        }
      },
      { upsert: true }
    )
    if (!updatedSession) {
      throw new HttpException("Can't update session", 400)
    }
    return {
      accessToken,
      refreshToken
    }
  }

  async me(accessToken: string) {
    const decoded = this.verifyAccessToken(accessToken) as TokenPayload
    const user = await this.userModel.findOne({ _id: decoded._id })
    if (!user) {
      throw new HttpException('User not found', 404)
    }
    return user
  }

  async startRegistrationPasskey(email: string): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const account = await this.accountModel.findOne({
      email
    })
    if (!account) {
      throw new HttpException('Account not found', 404)
    }
    const registrationOptions = await generateRegistrationOptions({
      rpName: process.env.APP_NAME ?? 'FCSM',
      rpID: process.env.CLIENT_HOST ?? 'localhost',
      userName: account.username,
      attestationType: 'none',
      excludeCredentials: account.passkeys.map((passkey) => ({
        id: passkey.credential_id,
        transports: passkey.transports as AuthenticatorTransportFuture[]
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'required',
        authenticatorAttachment: 'cross-platform'
      }
    })

    return registrationOptions
  }

  async verifyRegistration(verifyDto: VerifyRegistrationPasskeyDto) {
    const { challenge, device, device_id, email, response } = verifyDto
    const verifyResponse = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: process.env.CLIENT_APP_URL ?? '',
      expectedRPID: process.env.CLIENT_HOST
    })

    if (verifyResponse.verified) {
      const user = await this.userModel.findOne({ email })
      if (!user) {
        throw new HttpException('User not found', 404)
      }
      const payload: TokenPayload = {
        _id: user._id as string,
        email,
        roles: user.roles ?? [],
        username: user.username,
        device_id
      }
      const accessToken = this.signAccessToken(payload)
      const refreshToken = this.signRefreshToken(payload)

      const upsertSession = await this.sessionModel.updateOne(
        { device_id },
        {
          $set: {
            device,
            device_id,
            access_token: accessToken,
            refresh_token: refreshToken,
            access_token_expires_at: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRE_AT)),
            refresh_token_expires_at: new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRE_AT))
          }
        },
        { upsert: true }
      )
      if (!upsertSession) {
        throw new HttpException("Can't create session", 500)
      }

      if (upsertSession.upsertedId) {
        const updatedAccount = await this.accountModel.updateOne(
          { email },
          {
            $push: {
              sessions: upsertSession.upsertedId
            }
          }
        )
        if (!updatedAccount) {
          throw new HttpException("Can't update account", 500)
        }
      }
    }
  }

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
      throw new HttpException('Error while sign refresh token', 500)
    }
  }

  verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? '')
    } catch (err) {
      throw new HttpException('Error while sign refresh token', 401)
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? '')
    } catch (err) {
      throw new HttpException('Error while sign refresh token', 401)
    }
  }
}
