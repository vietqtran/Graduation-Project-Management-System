import { Router } from 'express'
import { UploadDocumentController } from '@/controllers/document.controller'

const router = Router()
const documentController = new UploadDocumentController()

router.post('/', documentController.createDocument)
router.get('/:id', documentController.getDocumentById)
router.get('/user/:userId', documentController.getDocumentsByUserId)
router.get('/project/:projectId', documentController.getDocumentsByProjectId)
router.put('/:id', documentController.updateDocument)
router.delete('/:id', documentController.deleteDocument)
router.post('/delete-multiple', documentController.deleteMultipleDocuments)
router.delete('/project/:projectId', documentController.deleteDocumentsByProjectId)

export { router as documentRoutes }
