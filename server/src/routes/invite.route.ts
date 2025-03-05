import { Router } from 'express'
import { InviteController } from '@/controllers/invite.controller'
const router = Router()
const inviteController = new InviteController()

router.get('/get-all', inviteController.getAllInvites)
router.get('/get-invites/:userId', inviteController.getInvitesOfUser)
router.post('/invite-member', inviteController.sendInvite)
router.get('/accept-invite/:id', inviteController.acceptInvite)
router.get('/reject-invite/:id', inviteController.rejectInvite)
export { router as inviteRoutes }
