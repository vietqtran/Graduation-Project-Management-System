import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { HttpException } from '@/shared/exceptions/http.exception'

dotenv.config()

export class JwtService {
  constructor() {}

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
