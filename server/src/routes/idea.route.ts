import { Router } from 'express'
import { IdeaController } from '@/controllers/idea.controller'

const router = Router()

const ideaController = new IdeaController()
router.post('/create-idea', ideaController.createIdea)
router.get('/get-idea-student', ideaController.getIdeaStudent)
router.delete('/delete-idea', ideaController.deleteIdea)

export { router as ideaRoutes }
