import { RequestController } from '@/controllers/request.controller'
import { Router } from 'express'

const router = Router()
const requestController = new RequestController()

router.get('/get-all-requests', requestController.getAllRequests)
router.post('/create-request', requestController.createRequest)
router.post('/approve/:id', requestController.approveRequest)
router.post('/deny/:id', requestController.denyRequest)
router.delete('/delete-request/:id', requestController.deleteRequest)
router.get('/get-request-by-id/:id', requestController.getRequestById)
export { router as requestRoutes }
