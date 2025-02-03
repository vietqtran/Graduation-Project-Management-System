import { DeadlineController } from '@/controllers/deadline.controller'
import { CreateParameterDto, UpdateParameterDto } from '@/dtos/deadline/parameter.dto'
import { validateDto } from '@/middlewares/validate.middleware'
import { Router } from 'express'

const router = Router()
const deadlineController = new DeadlineController()

router.get('/getAll', deadlineController.getAllParameters)
router.post('/create', validateDto(CreateParameterDto), deadlineController.createParameter)
router.post('/update', validateDto(UpdateParameterDto), deadlineController.updateParameter)

export { router as parameterRoutes }