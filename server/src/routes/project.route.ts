import { ProjectController } from '@/controllers/project.controller'
import { StaffGetDetailProjectDto, StaffGetListProjectsDto } from '@/dtos/project/staff-manage-projects.dto'
import { validateDto } from '@/middlewares/validate.middleware'
import { Router } from 'express'

const router = Router()
const projectController = new ProjectController()

router.get('/', projectController.getProjectByUserId)
router.post('/staff-get-list-projects', validateDto(StaffGetListProjectsDto), projectController.staffGetListProjects)
router.post('/staff-get-detail-project', validateDto(StaffGetDetailProjectDto),projectController.staffGetDetailProject)

export { router as projectRoutes }
