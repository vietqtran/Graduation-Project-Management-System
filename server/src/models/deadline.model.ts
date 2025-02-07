import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUser } from './user.model'
import { semesterRegex } from '../constants/regex'

export interface IDeadline extends Document {
  deadline_key: string
  deadline_date?: Date
  semester: string
  created_by: IUser['_id']
  updated_by: IUser['_id']
}

export const DeadlineSchema = new Schema<IDeadline>(
  {
    deadline_key: {
      type: String,
      required: [true, 'Deadline key is required'],
      unique: true
    },
    deadline_date: {
      type: Date
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      match: [semesterRegex, 'Please provide a valid semester']
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created user is required']
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Updated user is required']
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

const DeadlineModel: Model<IDeadline> = mongoose.model<IDeadline>('Deadline', DeadlineSchema)
export default DeadlineModel
