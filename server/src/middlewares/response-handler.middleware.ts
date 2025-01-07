export interface CustomResponse {
  success: boolean
  data: any
  message: string
  timestamp: string
  path: string
  statusCode: number
}

import { Request, Response, NextFunction } from 'express'

export class ResponseHandler {
  static success(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json
    const originalSend = res.send

    res.json = function (data: any): Response {
      const customResponse: CustomResponse = {
        success: true,
        data: data || null,
        message: res.locals.message || 'Operation successful',
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        statusCode: res.statusCode
      }

      return originalJson.call(this, customResponse)
    }

    res.send = function (data: any): Response {
      if (typeof data === 'object') {
        return res.json(data)
      }
      return originalSend.call(this, data)
    }

    next()
  }

  static sendSuccess(res: Response, data: any = null, message: string = 'Success') {
    res.locals.message = message
    return res.status(200).json(data)
  }

  static sendCreated(res: Response, data: any = null, message: string = 'Resource created successfully') {
    res.locals.message = message
    return res.status(201).json(data)
  }

  static sendError(res: Response, error: any) {
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal server error'

    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      data: null
    })
  }
}
