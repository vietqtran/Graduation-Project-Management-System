import mongoose, { Model, Schema } from 'mongoose'

import { ICampus } from './campus.model'
import { IField } from './field.model'
import { IHistory } from './history.model'
import { IMajor } from './major.model'
import { ITask } from './task.model'
import { IUser } from './user.model'
import { PROJECT_STATUS } from '@/constants/status'

export interface IProject extends Document {
  name: string
  description: string
  members: IUser['_id'][]
  leader: IUser['_id']
  supervisor: IUser['_id'][]
  major: IMajor['_id'][]
  field: IField['_id'][]
  campus: ICampus['_id']
  mark: number
  histories: IHistory['_id'][]
  //1: chủ đề của sinh viên, 2: chủ đề của giảng viên
  category: 1 | 2
  tasks: ITask['_id'][]
  status: number
  stage: number
  slow_count: number
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [3, 'Project name must be at least 3 characters'],
      maxlength: [200, 'Project name cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'At least one member is required']
      }
    ],
    leader: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Leader is required']
    },
    supervisor: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    major: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Major',
        required: [true, 'At least one major is required']
      }
    ],
    field: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: [true, 'At least one field is required']
      }
    ],
    campus: {
      type: Schema.Types.ObjectId,
      ref: 'Campus',
      required: [true, 'Campus is required']
    },
    mark: {
      type: Number,
      default: null
    },
    histories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'History'
      }
    ],
    category: {
      type: Number,
      required: [true, 'Category is required'],
      enum: {
        values: [1, 2],
        message: '{VALUE} is not a valid category'
      }
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task'
      }
    ],
    status: {
      type: Number,
      enum: PROJECT_STATUS
    },
    stage: {
      type: Number,
      default: 1
    },
    slow_count: {
      type: Number,
      default: 0
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
const ProjectModel: Model<IProject> = mongoose.model<IProject>('Project', ProjectSchema)
export default ProjectModel
