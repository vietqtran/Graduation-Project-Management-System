import { ProjectController } from '@/controllers/project.controller'
import {
  StaffGetDetailProjectDto,
  staffGetListAvailableStudentsDto,
  staffGetListAvailableSupervisorsDto,
  StaffGetListProjectsDto,
  StaffUpdateProjectDto
} from '@/dtos/project/staff-manage-projects.dto'
import { validateDto } from '@/middlewares/validate.middleware'
import { Router } from 'express'

const router = Router()
const projectController = new ProjectController()

router.get('/', projectController.getProjectByUserId)
router.post('/staff-get-list-projects', validateDto(StaffGetListProjectsDto), projectController.staffGetListProjects)
router.post('/staff-get-detail-project', validateDto(StaffGetDetailProjectDto), projectController.staffGetDetailProject)
router.post('/staff-update-project', validateDto(StaffUpdateProjectDto), projectController.staffUpdateProject)
router.post(
  '/staff-get-list-available-supervisors',
  validateDto(staffGetListAvailableSupervisorsDto),
  projectController.staffGetListAvailableSupervisors
)
router.post(
  '/staff-get-list-available-students',
  validateDto(staffGetListAvailableStudentsDto),
  projectController.staffGetListAvailableStudents
)

export { router as projectRoutes }
