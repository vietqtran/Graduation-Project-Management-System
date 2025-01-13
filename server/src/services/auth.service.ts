import * as argon2 from 'argon2'
import * as dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken'

import AccountModel, { IAccount } from '@/models/account.model'
import SessionModel, { ISession } from '@/models/session.model'
import UserModel, { IUser } from '@/models/user.model'
import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse
} from '@simplewebauthn/server'

import { AuthenticatorTransportFuture } from '@simplewebauthn/types'
import { EmailQueue } from '@/queues/email.queue'
import { HttpException } from '@/shared/exceptions/http.exception'
import { MailService } from './mail.service'
import mongoose, { Model } from 'mongoose'
import { SignInDto } from '@/dtos/auth/sign-in.dto'
import { SignInGoogleDto } from '@/dtos/auth/sign-in-google.dto'
import { SignUpDto } from '@/dtos/auth/sign-up.dto'
import { SignUpWithGoogleDto } from '@/dtos/auth/sign-up-with-google.dto'
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

  async signUp(signUpDto: SignUpDto) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const { email, first_name, last_name, password, username, device, device_id } = signUpDto

      const isExistedAccount = await this.accountModel
        .findOne({
          $or: [{ username }, { email }]
        })
        .session(session)

      if (isExistedAccount) {
        throw new HttpException('User already existed', 400)
      }

      const hashedPassword = await this.hashPassword(password)
      const createdUser = await this.userModel.create(
        [
          {
            email,
            username,
            first_name,
            last_name,
            display_name: `${first_name} ${last_name}`
          }
        ],
        { session }
      )

      if (!createdUser[0]) {
        throw new HttpException("Can't create user", 500)
      }

      const payload: TokenPayload = {
        _id: createdUser[0]._id as string,
        email: createdUser[0].email,
        roles: createdUser[0].roles ?? [],
        username: createdUser[0].username,
        device_id
      }
      const accessToken = this.signAccessToken(payload)
      const refreshToken = this.signRefreshToken(payload)

      const createdSession = await this.sessionModel.create(
        [
          {
            device,
            device_id,
            access_token: accessToken,
            refresh_token: refreshToken,
            access_token_expires_at: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRE_AT)),
            refresh_token_expires_at: new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRE_AT))
          }
        ],
        { session }
      )

      if (!createdSession[0]) {
        throw new HttpException("Can't create session", 500)
      }

      const createdAccount = await this.accountModel.create(
        [
          {
            user_id: createdUser[0]._id,
            user: createdUser[0]._id,
            email,
            username,
            hashed_password: hashedPassword,
            sessions: [createdSession[0]._id]
          }
        ],
        { session }
      )

      if (!createdAccount[0]) {
        throw new HttpException("Can't create account", 500)
      }

      await session.commitTransaction()

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
        user: createdUser[0],
        accessToken,
        refreshToken,
        deviceId: device_id
      }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async signUpWithGoogle({ email, photoURL, device, device_id, displayName }: SignUpWithGoogleDto) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const username = email.split('@')[0]
      const length = displayName.split(' ').length
      const isContainsSpace = length > 1
      let first_name, last_name
      if (isContainsSpace) {
        first_name = displayName.split(' ')[0]
        last_name = displayName.split(' ')[length - 1]
      } else {
        first_name = ''
        last_name = displayName
      }

      const isExistedAccount = await this.accountModel
        .findOne({
          $or: [{ username }, { email }]
        })
        .session(session)

      if (isExistedAccount) {
        throw new HttpException('User already existed', 400)
      }

      const createdUser = await this.userModel.create(
        [
          {
            email,
            username,
            first_name,
            last_name,
            avatar: photoURL,
            display_name: `${first_name} ${last_name}`
          }
        ],
        { session }
      )

      if (!createdUser[0]) {
        throw new HttpException("Can't create user", 500)
      }

      const payload: TokenPayload = {
        _id: createdUser[0]._id as string,
        email: createdUser[0].email,
        roles: createdUser[0].roles ?? [],
        username: createdUser[0].username,
        device_id
      }
      const accessToken = this.signAccessToken(payload)
      const refreshToken = this.signRefreshToken(payload)

      const createdSession = await this.sessionModel.create(
        [
          {
            device,
            device_id,
            access_token: accessToken,
            refresh_token: refreshToken,
            access_token_expires_at: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRE_AT)),
            refresh_token_expires_at: new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRE_AT))
          }
        ],
        { session }
      )

      if (!createdSession[0]) {
        throw new HttpException("Can't create session", 500)
      }

      const hashedPassword = await this.hashPassword('123@123')

      const createdAccount = await this.accountModel.create(
        [
          {
            user_id: createdUser[0]._id,
            user: createdUser[0]._id,
            email,
            username,
            hashed_password: hashedPassword,
            sessions: [createdSession[0]._id]
          }
        ],
        { session }
      )

      if (!createdAccount[0]) {
        throw new HttpException("Can't create account", 500)
      }

      await session.commitTransaction()

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
        user: createdUser[0],
        accessToken,
        refreshToken,
        deviceId: device_id
      }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async signIn(signInDto: SignInDto) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const { email, password, device, device_id } = signInDto
      const account = await this.accountModel.findOne({ email }).populate('user').session(session)
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
        { upsert: true, session }
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
          },
          { session }
        )
        if (!updatedAccount) {
          throw new HttpException("Can't update account", 500)
        }
      }

      await session.commitTransaction()

      return {
        user: account.user,
        accessToken,
        refreshToken,
        deviceId: device_id
      }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async signInWithGoogle({ displayName, email, photoURL, device, device_id }: SignInGoogleDto) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const account = await this.accountModel.findOne({ email }).populate('user').session(session)
      if (!account) {
        throw new HttpException('Account not found', 404)
      }

      const userUpdated = await this.userModel.updateOne(
        { _id: account.user_id },
        {
          $set: {
            display_name: displayName,
            avatar: photoURL
          }
        },
        { session }
      )

      if (!userUpdated.modifiedCount) {
        throw new HttpException("Can't update user", 500)
      }

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
        { upsert: true, session }
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
          },
          { session }
        )
        if (!updatedAccount) {
          throw new HttpException("Can't update account", 500)
        }
      }

      await session.commitTransaction()

      return {
        user: account.user,
        accessToken,
        refreshToken,
        deviceId: device_id
      }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async logout(accessToken: string) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const decoded = this.verifyAccessToken(accessToken) as TokenPayload
      const sessionDoc = await this.sessionModel
        .findOne({
          device_id: decoded.device_id
        })
        .session(session)

      if (!sessionDoc) {
        throw new HttpException('Session not found', 404)
      }

      const deletedSession = await this.sessionModel
        .deleteOne({
          _id: sessionDoc._id
        })
        .session(session)

      if (!deletedSession) {
        throw new HttpException('Error at delete session', 500)
      }

      const account = await this.accountModel.findOne({ user_id: decoded._id }).session(session)
      if (!account) {
        throw new HttpException('Account not found', 404)
      }

      const updatedAccount = await this.accountModel.updateOne(
        { _id: account._id },
        {
          $set: {
            sessions: account.sessions.filter((s: any) => !s.equals(sessionDoc._id))
          }
        },
        { session }
      )

      if (!updatedAccount) {
        throw new HttpException('Error at update account', 500)
      }

      await session.commitTransaction()
      return null
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async refresh(token: string) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const decoded = this.verifyRefreshToken(token) as TokenPayload
      const user = await this.userModel.findOne({ _id: decoded._id }).session(session)
      if (!user) {
        throw new HttpException('User not found', 404)
      }
      const sessionDoc = await this.sessionModel
        .findOne({
          device_id: decoded.device_id
        })
        .session(session)
      if (!sessionDoc) {
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
        { _id: sessionDoc._id },
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
      await session.commitTransaction()
      return {
        accessToken,
        refreshToken
      }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async me(accessToken: string) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const decoded = this.verifyAccessToken(accessToken) as TokenPayload
      const user = await this.userModel.findOne({ _id: decoded._id }).session(session)
      if (!user) {
        throw new HttpException('User not found', 404)
      }
      await session.commitTransaction()
      return user
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async startRegistrationPasskey(accessToken: string): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const decoded = this.verifyAccessToken(accessToken) as TokenPayload
      const account = await this.accountModel
        .findOne({
          user_id: decoded._id
        })
        .session(session)
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
      await session.commitTransaction()
      return registrationOptions
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async verifyRegistration(accessToken: string, dto: VerifyRegistrationPasskeyDto) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const decoded = this.verifyAccessToken(accessToken) as TokenPayload
      const { challenge, response } = dto
      const verifyResponse = await verifyRegistrationResponse({
        response,
        expectedChallenge: challenge,
        expectedOrigin: process.env.CLIENT_URL ?? 'https://localhost:3000',
        expectedRPID: process.env.CLIENT_HOST ?? 'localhost'
      })

      if (verifyResponse.verified) {
        const account = await this.accountModel
          .findOne({
            email: decoded.email
          })
          .session(session)
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
          },
          { session }
        )
        if (!updatedAccount) {
          throw new HttpException("Can't update account", 400)
        }
        await session.commitTransaction()
        return null
      }
      throw new HttpException('Failed to verify registration', 400)
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async startAuthentication(email: string) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const account = await this.accountModel
        .findOne({
          email
        })
        .session(session)
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
      await session.commitTransaction()
      return options
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async verifyAuthentication(dto: VerifyAuthenticationPasskey) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { email, response, challenge, device_id, device } = dto
      const account = await this.accountModel
        .findOne({
          email
        })
        .populate('user')
        .session(session)
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
            { upsert: true, session }
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
              },
              { session }
            )
            if (!updatedAccount) {
              throw new HttpException("Can't update account", 500)
            }
          }
          await session.commitTransaction()
          return {
            user: account.user,
            accessToken,
            refreshToken,
            deviceId: device_id
          }
        }
      }
      throw new HttpException('Failed to verify authentication', 400)
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
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
