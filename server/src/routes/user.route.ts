import { Router } from 'express'
import { UserController } from '@/controllers/user.controller'

const router = Router()
const userController = new UserController()

router.get('/', (req, res, next) => userController.getAllUsers(req, res, next))
router.post('/create', (req, res, next) => userController.createUser(req, res, next))

export { router as userRoutes }
