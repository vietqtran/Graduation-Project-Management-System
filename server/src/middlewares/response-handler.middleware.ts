export interface CustomResponse {
  success: boolean
  data: any
  message: string
  timestamp: string
  path: string
  statusCode: number
}

import { NextFunction, Request, Response } from 'express'

export class ResponseHandler {
  static sendSuccess(res: Response, data: any = null, message: string = 'Success') {
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
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        statusCode
      }
    })
  }
}
