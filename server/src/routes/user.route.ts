import { Router } from 'express'
import { Container } from 'typedi'
import { UserController } from '@/controllers/user.controller'

const router = Router()
const userController = Container.get(UserController)

router.get('/', (req, res, next) => userController.getAllUsers(req, res, next))
router.post('/create', (req, res, next) => userController.createUser(req, res, next))

export { router as userRoutes }
