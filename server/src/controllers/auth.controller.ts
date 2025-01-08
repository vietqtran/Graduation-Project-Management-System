import { NextFunction, Request, Response } from 'express'

import { AuthService } from '@/services/auth.service'
import { HttpException } from '@/shared/exceptions/http.exception'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { SignInDto } from '@/dtos/auth/sign-in.dto'
import { SignUpDto } from '@/dtos/auth/sign-up.dto'

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

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const cookie = req.cookies['Authentication'] as string
      if (!cookie) {
        throw new HttpException('Authentication cookie is missing', 401)
      }
      const response = await this.authService.me(cookie)
      ResponseHandler.sendSuccess(res, response, 'Get current user successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

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
}
