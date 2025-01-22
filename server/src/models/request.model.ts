import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUser } from './user.model'

export interface IRequest extends Document {
  to_user: IUser['_id']
  from_user: IUser['_id']
  status: string
  approve_user: IUser['_id']
  remark: string
  type: string
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
        values: ['pending', 'approved', 'rejected'],
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
