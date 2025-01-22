import mongoose, { Document, Model, Schema } from 'mongoose'
import { IResource } from './resource.model'
import { IUser } from './user.model'
import { CommentSchema, IComment } from './comment.model'

export interface ITask extends Document {
  name: string
  description: string
  assignees: IUser['_id']
  type: string
  start_date: Date
  due_date: Date
  created_by: IUser['_id']
  labels: string[]
  is_completed: boolean
  status: string
  comments: IComment
  resources: IResource['_id'][]
  column_id: string
}

const TaskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      required: [true, 'Task name is required'],
      trim: true,
      minlength: [3, 'Task name must be at least 3 characters'],
      maxlength: [200, 'Task name cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'At least one assignee is required']
      }
    ],
    type: {
      type: String,
      enum: {
        values: ['milestone', 'task'],
        message: '{VALUE} is not a valid task type'
      },
      required: [true, 'Task type is required']
    },
    start_date: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.due_date || value <= this.due_date
        },
        message: 'Start date must be before or equal to due date'
      }
    },
    due_date: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.start_date || value >= this.start_date
        },
        message: 'Due date must be after or equal to start date'
      }
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task creator is required']
    },
    labels: [
      {
        type: String,
        trim: true,
        maxlength: [20, 'Label cannot exceed 20 characters']
      }
    ],
    is_completed: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['todo', 'in-progress', 'review', 'done'],
        message: '{VALUE} is not a valid status'
      },
      default: 'todo'
    },
    comments: [
      {
        type: CommentSchema,
        default: []
      }
    ],
    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      }
    ],
    column_id: {
      type: String,
      required: [true, 'Column ID is required']
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    versionKey: false
  }
)

const TaskModel: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema)
export default TaskModel
