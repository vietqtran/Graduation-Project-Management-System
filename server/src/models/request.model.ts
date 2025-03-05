import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUser } from './user.model'
import { IUploadDocument } from './document.model'

export interface IRequest extends Document {
  to_user: IUser['_id']
  from_user: IUser['_id']
  status: string
  approve_user: IUser['_id']
  remark: string
  type: string
  description: string
  documents: IUploadDocument['_id'][]
  due_date: Date
  createdAt: Date
  updatedAt: Date
}

export const RequestSchema = new Schema<IRequest>(
  {
    to_user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user is required']
    },
    from_user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender user is required']
    },
    status: {
      type: String,
      enum: {
        values: ['assigned', 'submitted', 'completed', 'in progress', 'overdue'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pending'
    },
    approve_user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    remark: {
      type: String,
      trim: true,
      maxlength: [500, 'Remark cannot exceed 500 characters']
    },
    type: {
      type: String,
      required: [true, 'Request type is required'],
      enum: {
        values: ['project', 'defense', 'extension', 'other'],
        message: '{VALUE} is not a valid request type'
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UploadDocument'
      }
    ],
    due_date: {
      type: Date,
      required: [true, 'Due date is required']
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

const RequestModel: Model<IRequest> = mongoose.model<IRequest>('Request', RequestSchema)
export default RequestModel
