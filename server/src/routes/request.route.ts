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
router.get('/get-requests-by-user/:userId', requestController.getRequestsByUserId)
router.patch('/update-request/:requestId', requestController.updateRequest)
router.get('/student', requestController.getStudentRequests)
router.post('/student/upload', requestController.uploadDocument)
router.post('/student/submit', requestController.submitRequest)
router.get('/check-eligibility', requestController.checkEligibility)
export { router as requestRoutes }
