import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUser } from './user.model'
import { IProject } from './project.model'

export interface IColumn extends Document {
  title: string
  description?: string
  project: IProject['_id']
  position: number
  created_by: IUser['_id']
  is_archived: boolean
  color?: string
  task_limit?: number
}

const ColumnSchema = new Schema<IColumn>(
  {
    title: {
      type: String,
      required: [true, 'Column title is required'],
      trim: true,
      minlength: [2, 'Column title must be at least 2 characters'],
      maxlength: [50, 'Column title cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required']
    },
    position: {
      type: Number,
      required: [true, 'Position is required'],
      default: 0
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Column creator is required']
    },
    is_archived: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#E2E8F0'
    },
    task_limit: {
      type: Number,
      min: [0, 'Task limit cannot be negative']
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

ColumnSchema.index({ project: 1, position: 1 })

export const ColumnModel: Model<IColumn> = mongoose.model<IColumn>('Column', ColumnSchema)

export default { ColumnModel }
