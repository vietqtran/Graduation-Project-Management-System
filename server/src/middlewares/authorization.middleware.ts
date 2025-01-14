import { HttpException } from '@/shared/exceptions/http.exception'
import { TokenPayload } from '@/shared/interfaces/token-payload.interface'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (requiredRoles?: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!requiredRoles) {
      next()
    }
    const token = req.cookies['Authentication']
    if (!token) {
      throw new HttpException('Authentication cookie is missing', 401)
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? '') as TokenPayload
      req.user = decoded
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = decoded.roles.some((role) => requiredRoles.includes(role))
        if (!hasRequiredRole) {
          throw new HttpException('You do not have permission to access this resource', 403)
        }
      }
      next()
    } catch (err) {
      throw new HttpException("Can't verify token", 500)
    }
  }
}
