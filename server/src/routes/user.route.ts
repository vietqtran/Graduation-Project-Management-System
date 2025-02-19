import { Router } from 'express'
import { UserController } from '@/controllers/user.controller'
import { validateDto } from '@/middlewares/validate.middleware'
import { GetListStudentsDto, StaffGetDetailStudentDto, StaffUpdateStudentDto } from '@/dtos/user/staff-manage-students.dto'
import { GetListTeachersDto, StaffGetDetailTeacherDto, StaffUpdateTeacherDto } from '@/dtos/user/staff-manage-teachers.dto'

const router = Router()
const userController = new UserController()

router.get('/', (req, res, next) => userController.getAllUsers(req, res, next))
router.post('/', (req, res, next) => userController.createUser(req, res, next))
router.post('/staff-get-list-students', validateDto(GetListStudentsDto), userController.staffGetListStudents)
router.post('/staff-get-detail-student', validateDto(StaffGetDetailStudentDto), userController.staffGetDetailStudent)
router.post('/staff-update-student', validateDto(StaffUpdateStudentDto), userController.staffUpdateStudent)
router.post('/staff-get-list-teachers', validateDto(GetListTeachersDto), userController.staffGetListTeachers)
router.post('/staff-get-detail-teacher', validateDto(StaffGetDetailTeacherDto), userController.staffGetDetailTeacher)
router.post('/staff-update-teacher', validateDto(StaffUpdateTeacherDto), userController.staffUpdateTeacher)
export { router as userRoutes }
