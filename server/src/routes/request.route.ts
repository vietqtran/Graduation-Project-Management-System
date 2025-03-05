import { RequestController } from '@/controllers/request.controller'
import { Router } from 'express'

const router = Router()
const requestController = new RequestController()

router.get('/get-all-requests', requestController.getAllRequests)
router.post('/create-request', requestController.createRequest)
router.post('/approve/:id', requestController.approveRequest)
router.post('/deny/:id', requestController.denyRequest)
router.delete('/delete-request/:id', requestController.deleteRequest)
export { router as requestRoutes }
