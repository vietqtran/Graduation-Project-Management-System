import { PublicController } from '@/controllers/public.controller'
import { Router } from 'express'

const router = Router()
const publicController = new PublicController()

router.get('/campuses', publicController.getAllCampuses)
router.get('/fields', publicController.getAllFields)
router.get('/majors', publicController.getAllMajors)

export { router as publicRoutes }
