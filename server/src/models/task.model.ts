import { CommentSchema, IComment } from './comment.model'
import mongoose, { Document, Model, Schema } from 'mongoose'

import { IColumn } from './column.model'
import { IProject } from './project.model'
import { IResource } from './resource.model'
import { IUploadDocument } from './document.model'
import { IUser } from './user.model'

export interface ITask extends Document {
  name: string
  description?: string
  assignees: IUser['_id'][]
  type: 'milestone' | 'task'
  start_date?: Date
  due_date?: Date
  created_by: IUser['_id']
  labels: {
    _id: string
    text: string
    color: string
  }[]
  is_completed: boolean
  status: 'todo' | 'in-progress' | 'review' | 'done'
  comments: IComment[]
  resources: IResource['_id'][]
  documents: IUploadDocument['_id'][]
  project: IProject['_id']
  column: IColumn['_id']
  position: number
  checklist: {
    title: string
    items: {
      text: string
      is_completed: boolean
      created_at: Date
    }[]
  }[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  cover_image?: string
  watched_by: IUser['_id'][]
  is_archived: boolean
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
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    type: {
      type: String,
      enum: {
        values: ['milestone', 'task'],
        message: '{VALUE} is not a valid task type'
      },
      required: [true, 'Task type is required'],
      default: 'task'
    },
    start_date: {
      type: Date,
      validate: {
        validator: function (this: ITask, value: Date) {
          return !this.due_date || value <= this.due_date
        },
        message: 'Start date must be before or equal to due date'
      }
    },
    due_date: {
      type: Date,
      validate: {
        validator: function (this: ITask, value: Date) {
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
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required']
    },
    labels: [
      {
        _id: {
          type: String,
          ref: 'Label'
        },
        text: {
          type: String,
          trim: true,
          maxlength: [20, 'Label text cannot exceed 20 characters']
        },
        color: {
          type: String,
          default: '#3498db'
        }
      }
    ],
    is_completed: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in-progress', 'review', 'done'],
        message: '{VALUE} is not a valid status'
      },
      default: 'todo'
    },
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UploadDocument'
      }
    ],
    comments: [CommentSchema],
    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      }
    ],
    column: {
      type: Schema.Types.ObjectId,
      ref: 'Column',
      required: [true, 'Column reference is required']
    },
    position: {
      type: Number,
      required: [true, 'Position within column is required'],
      default: 0
    },
    checklist: [
      {
        title: {
          type: String,
          required: [true, 'Checklist title is required'],
          trim: true
        },
        items: [
          {
            text: {
              type: String,
              required: [true, 'Checklist item text is required'],
              trim: true
            },
            is_completed: {
              type: Boolean,
              default: false
            },
            created_at: {
              type: Date,
              default: Date.now
            }
          }
        ]
      }
    ],
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: '{VALUE} is not a valid priority level'
      },
      default: 'medium'
    },
    cover_image: {
      type: String
    },
    watched_by: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    is_archived: {
      type: Boolean,
      default: false
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

TaskSchema.index({ project: 1, column: 1 })
TaskSchema.index({ position: 1 })

export const TaskModel: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema)

export default { TaskModel }
