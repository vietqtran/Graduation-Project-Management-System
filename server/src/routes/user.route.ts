import { UserController } from '@/controllers/user.controller'
import { Router } from 'express'

const router = Router()
const userController = new UserController()

/**
 * @openapi
 * '/api/users/create':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                default: johndoe
 *              email:
 *                type: tranquocviet1303@gmail.com
 *                default: johndoe
 *              password:
 *                type: 123!abc
 *                default: johndoe
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        desccription: Server Error
 */
router.post('/create', (req, res, next) => userController.createUser(req, res, next))

export { router as userRoutes }
