import { NextFunction, Request, Response } from 'express'

import { AuthService } from '@/services/auth.service'
import { HttpException } from '@/shared/exceptions/http.exception'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { SignInDto } from '@/dtos/auth/sign-in.dto'
import { SignUpDto } from '@/dtos/auth/sign-up.dto'
import { asyncHandler } from '@/helpers/async-handler'

export class AuthController {
  private readonly authService: AuthService
  constructor() {
    this.authService = new AuthService()
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const signInDto: SignInDto = req.body
      const response = await this.authService.signIn(signInDto)
      ResponseHandler.sendSuccess(res, response, 'Sign in successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const signUpDto: SignUpDto = req.body
      const response = await this.authService.signUp(signUpDto)
      ResponseHandler.sendSuccess(res, response, 'Sign up successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  // async me(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const cookie = req.cookies['Authentication'] as string
  //     if (!cookie) {
  //       throw new HttpException('Authentication cookie is missing', 401)
  //     }
  //     const response = await this.authService.me(cookie)
  //     ResponseHandler.sendSuccess(res, response, 'Get current user successfully')
  //   } catch (error) {
  //     ResponseHandler.sendError(res, error)
  //     next(error)
  //   }
  // }

  me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies['Authentication'] as string
    if (!cookie) {
      throw new HttpException('Authentication cookie is missing', 401)
    }
    const response = await this.authService.me(cookie)
    return ResponseHandler.sendSuccess(res, response, 'Get current user successfully')
  })

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const cookie = req.cookies['Refresh'] as string
      if (!cookie) {
        throw new HttpException('Refresh cookie is missing', 401)
      }
      const response = await this.authService.refresh(cookie)
      ResponseHandler.sendSuccess(res, response, 'Refresh token successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async logOut(req: Request, res: Response, next: NextFunction) {
    try {
      const cookie = req.cookies['Authentication'] as string
      if (!cookie) {
        throw new HttpException('Authentication cookie is missing', 401)
      }
      res.cookie('Authentication', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0
      })
      res.cookie('Refresh', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0
      })
      const response = await this.authService.logout(cookie)
      ResponseHandler.sendSuccess(res, response, 'Logout successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async startRegistrationPasskey(req: Request, res: Response, next: NextFunction) {
    try {
      const cookie = req.cookies['Authentication'] as string
      if (!cookie) {
        throw new HttpException('Refresh cookie is missing', 401)
      }
      const response = await this.authService.startRegistrationPasskey(cookie)
      ResponseHandler.sendSuccess(res, response, 'Get registration passkey payload successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async verifyRegistrationPasskey(req: Request, res: Response, next: NextFunction) {
    try {
      const cookie = req.cookies['Authentication'] as string
      if (!cookie) {
        throw new HttpException('Refresh cookie is missing', 401)
      }
      const payload = req.body
      const response = await this.authService.verifyRegistration(cookie, payload)
      ResponseHandler.sendSuccess(res, response, 'Passkey register successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async startAuthenticationPasskey(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.query
      const response = await this.authService.startAuthentication(email as string)
      ResponseHandler.sendSuccess(res, response, 'Get verify passkey payload successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async verifyAuthenticationPasskey(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body
      const response = await this.authService.verifyAuthentication(payload)
      ResponseHandler.sendSuccess(res, response, 'Passkey verified successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async googleSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body
      const response = await this.authService.signInWithGoogle(payload)
      ResponseHandler.sendSuccess(res, response, 'Sign in with Google successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async googleSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body
      const response = await this.authService.signUpWithGoogle(payload)
      ResponseHandler.sendSuccess(res, response, 'Sign up with Google successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }
}
