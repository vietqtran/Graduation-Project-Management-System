import mongoose, { Model, Schema } from 'mongoose'
import { IUser } from './user.model'
import { STUDENT_INQUIRY_STATUS } from '@/constants/status'

export interface IStudentInquiry extends Document {
  titile: string
  content: string
  status: number
  created_by: IUser['_id']
  updated_by: IUser['_id']
  answer: string
  answered_by: IUser['_id']
  created_at: Date
  updated_at: Date
  answered_at: Date
}

export const StudentInquirySchema = new Schema<IStudentInquiry>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: [10000, 'Content cannot exceed 10000 characters']
    },
    status: {
      type: Number,
      enum: STUDENT_INQUIRY_STATUS,
      default: STUDENT_INQUIRY_STATUS.PROCESSING
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
    },
    answer: {
      type: String,
      maxlength: [10000, 'Answer cannot exceed 10000 characters']
    },
    answered_by: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    answered_at: {
      type: Date
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

const StudentInquiryModel: Model<IStudentInquiry> = mongoose.model<IStudentInquiry>(
  'StudentInquiry',
  StudentInquirySchema
)
export default StudentInquiryModel
