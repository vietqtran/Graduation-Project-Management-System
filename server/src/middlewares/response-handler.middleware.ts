import { HttpException } from '@/shared/exceptions/http.exception'
import * as dotenv from 'dotenv'

import { ErrorRequestHandler, NextFunction, Response } from 'express'

dotenv.config()

export interface CustomResponse {
  success: boolean
  data: any
  message: string
  timestamp: string
  path: string
  statusCode: number
}
export class ResponseHandler {
  static sendSuccess(res: Response, data: any = null, message: string = 'Success') {
    if (data?.accessToken) {
      res.cookie('Authentication', data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: Number(process.env.JWT_ACCESS_EXPIRE_AT)
      })
    }

    if (data?.refreshToken) {
      res.cookie('Refresh', data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: Number(process.env.JWT_REFRESH_EXPIRE_AT)
      })
    }

    return res.status(200).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
      statusCode: res.statusCode,
      error: null
    })
  }

  static sendError(res: Response, error: any) {
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal server error'

    return res.status(statusCode).json({
      success: false,
      data: null,
      message,
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
      statusCode,
      error: {
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    })
  }
}

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // console.error(`[ERROR] ${req.method} ${req.url}:`, error);

  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal Server Error'

  if (error instanceof HttpException) {
    res.status(statusCode).json({
      success: false,
      data: null,
      message,
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
      statusCode,
      error: {
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    })
  } else {
    res.status(500).json({
      success: false,
      data: null,
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
      statusCode,
      error: {
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    })
  }
}
