
import { DeadlineController } from '@/controllers/deadline.controller'
import { GetDeadlinesDto, UpdateDeadlineDto } from '@/dtos/deadline/deadline.dto'
import { validateDto } from '@/middlewares/validate.middleware'
import { Router } from 'express'

const router = Router()
const deadlineController = new DeadlineController()

router.post('/getAll', validateDto(GetDeadlinesDto), deadlineController.getAllDeadlinesBySemester)
router.post('/update', validateDto(UpdateDeadlineDto), deadlineController.updateDeadline)

export { router as deadlineRoutes }