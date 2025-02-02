
import { DeadlineController } from '@/controllers/deadline.controller'
import { GetDeadlinesDto, UpdateDeadlineDto } from '@/dtos/deadline/deadline.dto'
import { validateDto } from '@/middlewares/validate.middleware'
import { Router } from 'express'

const router = Router()
const deadlineController = new DeadlineController()

router.post('/deadline/getAll', validateDto(GetDeadlinesDto), deadlineController.getAllDeadlinesBySemester)
router.post('/deadline/update', validateDto(UpdateDeadlineDto), deadlineController.updateDeadline)