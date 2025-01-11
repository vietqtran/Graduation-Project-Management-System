import * as argon2 from 'argon2'
import * as dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken'

import AccountModel, { IAccount } from '@/models/account.model'
import SessionModel, { ISession } from '@/models/session.model'
import UserModel, { IUser } from '@/models/user.model'
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse
} from '@simplewebauthn/server'

import { AuthenticatorTransportFuture } from '@simplewebauthn/types'
import { EmailQueue } from '@/queues/email.queue'
import { HttpException } from '@/shared/exceptions/http.exception'
import { MailService } from './mail.service'
import { Model } from 'mongoose'
import { SignInDto } from '@/dtos/auth/sign-in.dto'
import { SignUpDto } from '@/dtos/auth/sign-up.dto'
import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import { VerifyAuthenticationPasskey } from '@/dtos/auth/verify-authentication-passkey.dto'
import { VerifyRegistrationPasskeyDto } from '@/dtos/auth/verify-registration-passkey.dto'

dotenv.config()

export class AuthService {
  private readonly accountModel: Model<IAccount>
  private readonly userModel: Model<IUser>
  private readonly sessionModel: Model<ISession>
  private readonly mailService: MailService
  private readonly emailQueue: EmailQueue
  constructor() {
    this.accountModel = AccountModel
    this.userModel = UserModel
    this.sessionModel = SessionModel
    this.mailService = new MailService()
    this.emailQueue = new EmailQueue(this.mailService)
  }

  // Sign in method
  async signIn(signInDto: SignInDto) {
    const { email, password, device, device_id } = signInDto
    const account = await this.accountModel.findOne({ email }).populate('user')
    if (!account) {
      throw new HttpException('Account not found', 404)
    }
    await this.verifyPassword(account.hashed_password, password)
    const payload: TokenPayload = {
      _id: account.user._id as string,
      email: account.email,
      roles: account.user.roles ?? [],
      username: account.user.username,
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
      user: account.user,
      accessToken,
      refreshToken,
      deviceId: device_id
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, first_name, last_name, password, username, device, device_id } = signUpDto
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
      user: createdUser._id,
      email,
      username,
      hashed_password: hashedPassword,
      sessions: [createdSession._id]
    })

    if (!createdAccount) {
      throw new HttpException("Can't create account", 500)
    }

    this.emailQueue.addEmailJob({
      to: email,
      subject: 'Welcome to Graduation Project Management System',
      templateName: 'welcome',
      context: {
        first_name,
        last_name,
        year: new Date().getFullYear(),
        start_url: process.env.CLIENT_URL
      }
    })

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

  async startRegistrationPasskey(accessToken: string): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const decoded = this.verifyAccessToken(accessToken) as TokenPayload
    const account = await this.accountModel.findOne({
      user_id: decoded._id
    })
    if (!account) {
      throw new HttpException('Account not found', 404)
    }
    const registrationOptions = await generateRegistrationOptions({
      rpName: process.env.APP_NAME ?? 'GPMS',
      rpID: process.env.CLIENT_HOST ?? 'localhost',
      userName: decoded.username,
      attestationType: 'none',
      excludeCredentials: account.passkeys.map((passkey) => ({
        id: passkey.credential_id,
        transports: passkey.transports as AuthenticatorTransportFuture[]
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'required',
        authenticatorAttachment: 'platform'
      }
    })

    return registrationOptions
  }

  async verifyRegistration(accessToken: string, dto: VerifyRegistrationPasskeyDto) {
    const decoded = this.verifyAccessToken(accessToken) as TokenPayload
    const { challenge, response } = dto
    const verifyResponse = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: process.env.CLIENT_URL ?? 'https://localhost:3000',
      expectedRPID: process.env.CLIENT_HOST ?? 'localhost'
    })

    if (verifyResponse.verified) {
      const account = await this.accountModel.findOne({
        email: decoded.email
      })
      if (!account) {
        throw new HttpException('Account not found', 404)
      }
      const updatedAccount = await this.accountModel.updateOne(
        {
          _id: account._id
        },
        {
          $push: {
            passkeys: {
              ...verifyResponse,
              user_id: account.user_id,
              aaguid: verifyResponse.registrationInfo?.aaguid,
              credential_type: verifyResponse.registrationInfo?.credentialType,
              credential_id: verifyResponse.registrationInfo?.credential.id,
              public_key: Buffer.from(verifyResponse.registrationInfo?.credential.publicKey ?? '').toString('base64')
            }
          }
        }
      )
      if (!updatedAccount) {
        throw new HttpException("Can't update account", 400)
      }
      return null
    }
    throw new HttpException('Failed to verify registration', 400)
  }

  async startAuthentication(email: string) {
    const account = await this.accountModel.findOne({
      email
    })

    if (!account) {
      throw new HttpException('Account not found', 404)
    }

    const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
      rpID: 'localhost',
      allowCredentials: account.passkeys.map((passkey) => ({
        id: passkey.credential_id,
        transports: passkey.transports as AuthenticatorTransportFuture[]
      }))
    })

    if (!options) {
      console.error('Failed to start authentication')
      throw new HttpException('Failed to start authentication', 400)
    }

    return options
  }

  async verifyAuthentication(dto: VerifyAuthenticationPasskey) {
    const { email, response, challenge, device_id, device } = dto
    const account = await this.accountModel
      .findOne({
        email
      })
      .populate('user')
    if (!account) {
      throw new HttpException('Account not found', 404)
    }

    if (!account.passkeys || !Array.isArray(account.passkeys) || account.passkeys.length === 0) {
      throw new HttpException('Passkeys not found', 404)
    }

    for (const passkey of account.passkeys) {
      const verifyResponse = await verifyAuthenticationResponse({
        response,
        expectedChallenge: challenge,
        expectedOrigin: process.env.CLIENT_URL ?? 'https://localhost:3000',
        expectedRPID: process.env.CLIENT_HOST ?? 'localhost',
        credential: {
          id: passkey.credential_id,
          publicKey: Buffer.from(passkey.public_key, 'base64'),
          counter: passkey.counter,
          transports: passkey.transports as AuthenticatorTransportFuture[]
        }
      })

      if (verifyResponse.verified) {
        const payload: TokenPayload = {
          _id: account.user._id as string,
          email: account.email,
          roles: account.user.roles ?? [],
          username: account.user.username,
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
          user: account.user,
          accessToken,
          refreshToken,
          deviceId: device_id
        }
      }
    }
    throw new HttpException('Failed to verify authentication', 400)
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
