import { emailRegex, semesterRegex } from '@/constants/regex'
import mongoose, { Document, Model, Schema } from 'mongoose'

import { ICampus } from './campus.model'
import { IField } from './field.model'
import { IMajor } from './major.model'
import { IProject } from './project.model'
import { USER_STATUS } from '@/constants/status'
import { getCurrentSemester } from '@/helpers/date-helper'

export interface IUser extends Document {
  email: string
  username: string
  first_name: string
  last_name: string
  display_name: string
  avatar: string
  roles?: string[]
  status: number
  code: string
  campus: ICampus['_id']
  field: IField['_id'][]
  major: IMajor['_id'][]
  project?: IProject['_id']
  planned_semester: string
}

export const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [emailRegex, 'Please provide a valid email address']
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
    },
    first_name: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    display_name: { type: String, required: true, default: '', maxlength: 255 },
    last_name: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: { type: String, required: false, default: '' },
    roles: [
      {
        type: String,
        enum: {
          values: ['user', 'student', 'lecturer', 'admin', 'supervisor'],
          message: '{VALUE} is not a valid role'
        },
        required: false,
        default: ['user']
      }
    ],
    status: { type: Number, enum: USER_STATUS, required: false, default: USER_STATUS.UN_GROUPED },
    code: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[A-Z0-9]+$/, 'Code can only contain uppercase letters and numbers']
    },
    campus: {
      type: Schema.Types.ObjectId,
      ref: 'Campus'
      // required: [true, 'Campus is required']
    },
    field: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Field'
        // required: [true, 'Field is required']
      }
    ],
    major: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Major'
        // required: [true, 'Major is required']
      }
    ],
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      require: false
    },
    planned_semester: {
      type: String,
      required: [false, 'Semester of Capstone Project is required'],
      match: semesterRegex,
      default: getCurrentSemester()
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

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema)
export default UserModel
