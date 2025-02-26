import express from 'express'
import { TaskController, ColumnController } from '../controllers/task.controller'

const router = express.Router()
const taskController = new TaskController()
const columnController = new ColumnController()

router.get('/project/:projectId/tasks', (req, res, next) => taskController.getAllTasks(req, res, next))
router.post('/project/:projectId/tasks', (req, res, next) => taskController.createTask(req, res, next))
router.get('/tasks/:taskId', taskController.getTaskById)
router.patch('/tasks/:taskId', (req, res, next) => taskController.updateTask(req, res, next))
router.delete('/tasks/:taskId', (req, res, next) => taskController.deleteTask(req, res, next))
router.post('/tasks/:taskId/move', (req, res, next) => taskController.moveTask(req, res, next))
router.post('/tasks/:taskId/comments', (req, res, next) => taskController.addComment(req, res, next))
router.post('/tasks/:taskId/watch', (req, res, next) => taskController.toggleWatchTask(req, res, next))
router.patch('/tasks/:taskId/archive', (req, res, next) => taskController.archiveTask(req, res, next))
router.get('/project/:projectId/columns', (req, res, next) => columnController.getAllColumns(req, res, next))
router.post('/project/:projectId/columns', (req, res, next) => columnController.createColumn(req, res, next))
router.get('/columns/:columnId', columnController.getColumnById)
router.patch('/columns/:columnId', (req, res, next) => columnController.updateColumn(req, res, next))
router.delete('/columns/:columnId', (req, res, next) => columnController.deleteColumn(req, res, next))
router.post('/columns/:columnId/move', (req, res, next) => columnController.moveColumn(req, res, next))
router.patch('/columns/:columnId/archive', (req, res, next) => columnController.archiveColumn(req, res, next))

export { router as taskRoutes }
