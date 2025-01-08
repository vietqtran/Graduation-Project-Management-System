import { AuthController } from '@/controllers/auth.controller'
import { Router } from 'express'

const router = Router()
const authController = new AuthController()

router.post('/sign-in', (req, res, next) => authController.signIn(req, res, next))
router.post('/sign-up', (req, res, next) => authController.signUp(req, res, next))
router.get('/me', (req, res, next) => authController.me(req, res, next))
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next))
router.post('/log-out', (req, res, next) => authController.logOut(req, res, next))

export { router as authRoutes }
