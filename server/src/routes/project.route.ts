import { ProjectController } from '@/controllers/project.controller'
import { Router } from 'express'

const router = Router()
const projectController = new ProjectController()

router.get('/', projectController.getProjectByUserId)

export { router as projectRoutes }
