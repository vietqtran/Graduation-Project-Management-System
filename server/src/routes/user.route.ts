import { Router } from 'express'
import { UserController } from '@/controllers/user.controller'

const router = Router()
const userController = new UserController()

router.get('/', (req, res, next) => userController.getAllUsers(req, res, next))
router.post('/', (req, res, next) => userController.createUser(req, res, next))
router.post('/staff-get-list-students', (req, res, next) => userController.staffGetListStudents(req, res, next))
export { router as userRoutes }
