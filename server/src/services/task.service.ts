import { ColumnModel, IColumn } from '@/models/column.model'
import { ITask, TaskModel } from '../models/task.model'

import { EmailQueue } from '@/queues/email.queue'
import { HttpException } from '@/shared/exceptions/http.exception'
import { MailService } from './mail.service'
import mongoose from 'mongoose'

export class TaskService {
  private readonly emailQueue: EmailQueue
  private readonly mailService: MailService

  constructor() {
    this.emailQueue = new EmailQueue(this.mailService)
  }

  async createTask(taskData: Partial<ITask>, userId: string): Promise<ITask> {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const highestPositionTask = await TaskModel.findOne({
        column: taskData.column
      })
        .sort({ position: -1 })
        .limit(1)
        .session(session)

      const position = highestPositionTask ? highestPositionTask.position + 1 : 0

      const newTask = await TaskModel.create(
        [
          {
            ...taskData,
            created_by: userId,
            position
          }
        ],
        { session }
      )

      await session.commitTransaction()
      return newTask[0]
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async getAllTasks(projectId: string): Promise<ITask[]> {
    return TaskModel.find({ project: projectId, is_archived: false })
      .populate('assignees', 'name email avatar')
      .populate('created_by', 'name email')
      .populate('column', 'title position')
      .sort({ column: 1, position: 1 })
  }

  async getTaskById(taskId: string): Promise<ITask> {
    const task = await TaskModel.findById(taskId)
      .populate('assignees', '_id name email avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'created_by',
          select: '_id username email avatar'
        }
      })
    // .populate('created_by', 'name email')
    // .populate('column', 'title')
    // .populate('documents')
    // .populate('resources')

    if (!task) {
      throw new HttpException('Task not found', 404)
    }

    return task
  }

  async updateTask(taskId: string, updateData: Partial<ITask>, userEmail: string): Promise<ITask> {
    const oldTask = await TaskModel.findById(taskId)
    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId },
      {
        ...updateData,
        updated_at: new Date(),
        start_date: updateData.start_date ? new Date(updateData.start_date) : undefined,
        due_date: updateData.due_date ? new Date(updateData.due_date) : undefined
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate('assignees', '_id username email avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'created_by',
          select: '_id username email avatar'
        }
      })

    if (!task) {
      throw new HttpException('Task not found', 404)
    }
    const toEmails =
      (task.assignees as { _id: string; email: string }[]).map((assignee) =>
        !oldTask?.assignees.includes(assignee._id) ? assignee.email : null
      ) ?? []
    if (toEmails.length) {
      this.emailQueue.addEmailJob({
        to: [...toEmails],
        subject: 'Task assigned',
        templateName: 'task-assigned',
        context: {
          assignerName: userEmail,
          dueDate: task.due_date,
          taskDescription: task.description,
          taskTitle: task.name,
          year: new Date().getFullYear(),
          taskUrl: `${process.env.CLIENT_URL}/tasks?id=${task._id}`
        }
      })
    }

    return task
  }

  async deleteTask(taskId: string): Promise<void> {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const task = await TaskModel.findById(taskId).session(session)
      if (!task) {
        throw new HttpException('Task not found', 404)
      }

      await TaskModel.deleteOne({ _id: taskId }).session(session)

      await TaskModel.updateMany(
        {
          column: task.column,
          position: { $gt: task.position }
        },
        { $inc: { position: -1 } }
      ).session(session)

      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async moveTask(taskId: string, destinationColumnId: string, newPosition: number): Promise<ITask> {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const task = await TaskModel.findById(taskId).session(session)
      if (!task) {
        throw new HttpException('Task not found', 404)
      }

      const sourceColumnId = task.column?.toString()
      const oldPosition = task.position

      if (sourceColumnId === destinationColumnId) {
        if (oldPosition < newPosition) {
          await TaskModel.updateMany(
            {
              column: sourceColumnId,
              position: { $gt: oldPosition, $lte: newPosition }
            },
            { $inc: { position: -1 } }
          ).session(session)
        } else if (oldPosition > newPosition) {
          await TaskModel.updateMany(
            {
              column: sourceColumnId,
              position: { $gte: newPosition, $lt: oldPosition }
            },
            { $inc: { position: 1 } }
          ).session(session)
        }
      } else {
        await TaskModel.updateMany(
          {
            column: sourceColumnId,
            position: { $gt: oldPosition }
          },
          { $inc: { position: -1 } }
        ).session(session)

        await TaskModel.updateMany(
          {
            column: destinationColumnId,
            position: { $gte: newPosition }
          },
          { $inc: { position: 1 } }
        ).session(session)
      }

      const updatedTask = await TaskModel.findByIdAndUpdate(
        taskId,
        {
          column: destinationColumnId,
          position: newPosition,
          updated_at: new Date()
        },
        { new: true, runValidators: true }
      ).session(session)

      await session.commitTransaction()
      return updatedTask!
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async addComment(taskId: string, text: string, userId: string): Promise<ITask> {
    const task = await TaskModel.findByIdAndUpdate(
      taskId,
      {
        $push: {
          comments: {
            content: text,
            created_by: userId,
            created_at: new Date()
          }
        }
      },
      { new: true }
    ).populate({
      path: 'comments',
      populate: {
        path: 'created_by',
        select: '_id username email avatar'
      }
    })

    if (!task) {
      throw new HttpException('Task not found', 404)
    }

    return task
  }

  async toggleWatchTask(taskId: string, userId: string): Promise<ITask> {
    const task = await TaskModel.findById(taskId)

    if (!task) {
      throw new HttpException('Task not found', 404)
    }

    const isWatching = task.watched_by.some((id) => id?.toString() === userId)

    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      {
        [isWatching ? '$pull' : '$push']: {
          watched_by: userId
        }
      },
      { new: true }
    )

    return updatedTask!
  }

  async archiveTask(taskId: string): Promise<ITask> {
    const task = await TaskModel.findByIdAndUpdate(taskId, { is_archived: true }, { new: true })

    if (!task) {
      throw new HttpException('Task not found', 404)
    }

    return task
  }
}

export class ColumnService {
  async createColumn(columnData: Partial<IColumn>, userId: string): Promise<IColumn> {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const highestPositionColumn = await ColumnModel.findOne({
        project: columnData.project
      })
        .sort({ position: -1 })
        .limit(1)
        .session(session)

      const position = highestPositionColumn ? highestPositionColumn.position + 1 : 0

      const newColumn = await ColumnModel.create(
        [
          {
            ...columnData,
            created_by: userId,
            position
          }
        ],
        { session }
      )

      await session.commitTransaction()
      return newColumn[0]
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async getAllColumns(projectId: string): Promise<IColumn[]> {
    return ColumnModel.find({ project: projectId, is_archived: false }).sort({ position: 1 })
  }

  async getColumnById(columnId: string): Promise<IColumn> {
    const column = await ColumnModel.findById(columnId)

    if (!column) {
      throw new HttpException('Column not found', 404)
    }

    return column
  }

  async updateColumn(columnId: string, updateData: Partial<IColumn>): Promise<IColumn> {
    const column = await ColumnModel.findOneAndUpdate({ _id: columnId }, updateData, { new: true, runValidators: true })

    if (!column) {
      throw new HttpException('Column not found', 404)
    }

    return column
  }

  async deleteColumn(columnId: string): Promise<void> {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const column = await ColumnModel.findById(columnId).session(session)
      if (!column) {
        throw new HttpException('Column not found', 404)
      }

      await TaskModel.deleteMany({ column: columnId }).session(session)

      await ColumnModel.deleteOne({ _id: columnId }).session(session)

      await ColumnModel.updateMany(
        {
          project: column.project,
          position: { $gt: column.position }
        },
        { $inc: { position: -1 } }
      ).session(session)

      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async moveColumn(columnId: string, newPosition: number): Promise<IColumn> {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const column = await ColumnModel.findById(columnId).session(session)
      if (!column) {
        throw new HttpException('Column not found', 404)
      }

      const oldPosition = column.position
      const projectId = column.project

      if (oldPosition === newPosition) {
        await session.commitTransaction()
        return column
      }

      if (oldPosition < newPosition) {
        await ColumnModel.updateMany(
          {
            project: projectId,
            position: { $gt: oldPosition, $lte: newPosition }
          },
          { $inc: { position: -1 } }
        ).session(session)
      } else {
        await ColumnModel.updateMany(
          {
            project: projectId,
            position: { $gte: newPosition, $lt: oldPosition }
          },
          { $inc: { position: 1 } }
        ).session(session)
      }

      const updatedColumn = await ColumnModel.findByIdAndUpdate(
        columnId,
        { position: newPosition },
        { new: true, runValidators: true }
      ).session(session)

      await session.commitTransaction()
      return updatedColumn!
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async archiveColumn(columnId: string): Promise<IColumn> {
    const column = await ColumnModel.findByIdAndUpdate(columnId, { is_archived: true }, { new: true })

    if (!column) {
      throw new HttpException('Column not found', 404)
    }

    return column
  }
}
