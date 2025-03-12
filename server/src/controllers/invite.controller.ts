import { Request, Response, NextFunction } from 'express'

import { InviteService } from '@/services/invite.service'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { asyncHandler } from '@/helpers/async-handler'

export class InviteController {
  private readonly inviteService: InviteService

  constructor() {
    this.inviteService = new InviteService()
  }

  sendInvite = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inviteData = req.body
      const invite = await this.inviteService.sendInvite(inviteData)
      ResponseHandler.sendSuccess(res, invite)
    } catch (error) {
      next(error)
    }
  })
  getAllInvites = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invites = await this.inviteService.getAllInvites()
      ResponseHandler.sendSuccess(res, invites)
    } catch (error) {
      next(error)
    }
  })
  getInvitesOfUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId
      const invites = await this.inviteService.getInvitesOfUser(userId)
      ResponseHandler.sendSuccess(res, invites)
    } catch (error) {
      next(error)
    }
  })
  acceptInvite = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inviteId = req.params.id
      const invite = await this.inviteService.acceptInvite(inviteId)
      ResponseHandler.sendSuccess(res, invite)
    } catch (error) {
      next(error)
    }
  })
  rejectInvite = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inviteId = req.params.id
      const invite = await this.inviteService.rejectInvite(inviteId)
      ResponseHandler.sendSuccess(res, invite)
    } catch (error) {
      next(error)
    }
  })
}
