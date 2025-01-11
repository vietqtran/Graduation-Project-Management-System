import { AuthController } from '@/controllers/auth.controller'
import { Router } from 'express'

const router = Router()
const authController = new AuthController()

router.post('/sign-in', (req, res, next) => authController.signIn(req, res, next))
router.post('/sign-up', (req, res, next) => authController.signUp(req, res, next))
router.get('/me', (req, res, next) => authController.me(req, res, next))
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next))
router.post('/log-out', (req, res, next) => authController.logOut(req, res, next))
router.get('/passkey/registration', (req, res, next) => authController.startRegistrationPasskey(req, res, next))
router.post('/passkey/registration', (req, res, next) => authController.verifyRegistrationPasskey(req, res, next))
router.get('/passkey/verify', (req, res, next) => authController.startAuthenticationPasskey(req, res, next))
router.post('/passkey/verify-login', (req, res, next) => authController.verifyAuthenticationPasskey(req, res, next))
router.post('/google/sign-in', (req, res, next) => authController.googleSignIn(req, res, next))
router.post('/google/sign-up', (req, res, next) => authController.googleSignUp(req, res, next))

export { router as authRoutes }
