import { Request, Response, NextFunction } from 'express'
import { TaskService, ColumnService } from '../services/task.service'
import { ResponseHandler } from '@/middlewares/response-handler.middleware'
import { asyncHandler } from '@/helpers/async-handler'
import { getUser } from '@/helpers/auth-helper'

export class TaskController {
  private readonly taskService: TaskService

  constructor() {
    this.taskService = new TaskService()
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUser(req)
      const userId = user._id
      const taskData = req.body

      const task = await this.taskService.createTask(taskData, userId)

      ResponseHandler.sendSuccess(res, task, 'Task created successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async getAllTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params

      const tasks = await this.taskService.getAllTasks(projectId)

      ResponseHandler.sendSuccess(res, tasks, 'Tasks retrieved successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  getTaskById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params

    const task = await this.taskService.getTaskById(taskId)

    return ResponseHandler.sendSuccess(res, task, 'Task retrieved successfully')
  })

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params
      const user = getUser(req)
      const userId = user._id
      const updateData = req.body

      const task = await this.taskService.updateTask(taskId, updateData, userId)

      ResponseHandler.sendSuccess(res, task, 'Task updated successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params

      await this.taskService.deleteTask(taskId)

      ResponseHandler.sendSuccess(res, null, 'Task deleted successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async moveTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params
      const { destinationColumnId, position } = req.body

      const task = await this.taskService.moveTask(taskId, destinationColumnId, position)

      ResponseHandler.sendSuccess(res, task, 'Task moved successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params
      const user = getUser(req)
      const userId = user._id
      const { text } = req.body

      const task = await this.taskService.addComment(taskId, { text }, userId)

      ResponseHandler.sendSuccess(res, task, 'Comment added successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async toggleWatchTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params
      const user = getUser(req)
      const userId = user._id

      const task = await this.taskService.toggleWatchTask(taskId, userId)
      const isWatching = task.watched_by.some((id) => id?.toString() === userId)

      ResponseHandler.sendSuccess(
        res,
        { task, isWatching },
        isWatching ? 'Now watching task' : 'No longer watching task'
      )
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async archiveTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params

      const task = await this.taskService.archiveTask(taskId)

      ResponseHandler.sendSuccess(res, task, 'Task archived successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }
}

export class ColumnController {
  private readonly columnService: ColumnService

  constructor() {
    this.columnService = new ColumnService()
  }

  async createColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUser(req)
      const userId = user._id
      const columnData = req.body

      const column = await this.columnService.createColumn(columnData, userId)

      ResponseHandler.sendSuccess(res, column, 'Column created successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async getAllColumns(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params

      const columns = await this.columnService.getAllColumns(projectId)

      ResponseHandler.sendSuccess(res, columns, 'Columns retrieved successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  getColumnById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { columnId } = req.params

    const column = await this.columnService.getColumnById(columnId)

    return ResponseHandler.sendSuccess(res, column, 'Column retrieved successfully')
  })

  async updateColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const { columnId } = req.params
      const updateData = req.body

      const column = await this.columnService.updateColumn(columnId, updateData)

      ResponseHandler.sendSuccess(res, column, 'Column updated successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async deleteColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const { columnId } = req.params

      await this.columnService.deleteColumn(columnId)

      ResponseHandler.sendSuccess(res, null, 'Column deleted successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async moveColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const { columnId } = req.params
      const { position } = req.body

      const column = await this.columnService.moveColumn(columnId, position)

      ResponseHandler.sendSuccess(res, column, 'Column moved successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }

  async archiveColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const { columnId } = req.params

      const column = await this.columnService.archiveColumn(columnId)

      ResponseHandler.sendSuccess(res, column, 'Column archived successfully')
    } catch (error) {
      ResponseHandler.sendError(res, error)
      next(error)
    }
  }
}
