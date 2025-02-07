import { NextFunction } from 'express'

export class HttpException extends Error {
  public statusCode: number
  public message: string
  public data: null
  public success: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    this.data = null
    this.success = false
    Object.setPrototypeOf(this, HttpException.prototype)
  }
}
