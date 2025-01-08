import { SignInDto } from '@/dtos/auth/sign-in.dto'
import { SignUpDto } from '@/dtos/auth/sign-up.dto'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { AuthService } from '@/services/auth.service'
import { NextFunction, Request, Response } from 'express'
import { Service } from 'typedi'

@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
      const response = await this.authService.signIn(signUpDto)
      ResponseHandler.sendSuccess(res, response, 'Sign up successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }
}
