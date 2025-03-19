import {
  StaffGetDetailProjectDto,
  StaffGetListProjectsDto,
  StaffUpdateProjectDto,
  staffGetListAvailableStudentsDto,
  staffGetListAvailableSupervisorsDto
} from '@/dtos/project/staff-manage-projects.dto'

import { ProjectController } from '@/controllers/project.controller'
import { Router } from 'express'
import { validateDto } from '@/middlewares/validate.middleware'

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

router.post('/create-project-as-topic', projectController.createProjectAsTopic)
router.get('/get-project-with-null-status', projectController.getProjectsWithNullStatus)
router.get('/detail-topic/:id', projectController.getTopicDetail)
router.patch('/update-topic/:id', projectController.updateTopic)
router.delete('/delete-topic/:id', projectController.deleteTopic)
router.get('/get-projects-by-supervisor', projectController.getProjectsBySupervisor)
router.get('/get-projects-to-review', projectController.getProjectsToReview)
router.get('/get-project-leader-for-supervisor', projectController.getProjectLeaderForSupervisor)

// Add new route for getting project members
router.get('/:projectId/members', (req, res, next) => projectController.getProjectMembers(req, res, next))

router.patch('/approve-idea/:id', projectController.approveIdea)
router.get('/get-available-slots', projectController.checkAvailableSlot)
export { router as projectRoutes }
