import { RequestController } from '@/controllers/request.controller'
import { Router } from 'express'

const router = Router()
const requestController = new RequestController()

router.get('/requests', requestController.getAllRequests)
router.post('/create', requestController.createRequest)
router.post('/approve/:id', requestController.approveRequest)
router.post('/deny/:id', requestController.denyRequest)

export { router as requestRoutes }
