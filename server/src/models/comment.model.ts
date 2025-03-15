import mongoose, { Document, Schema } from 'mongoose'

import { IUser } from './user.model'

export interface IComment extends Document {
  content: string
  created_by: IUser['_id']
  created_at: Date
  updated_at?: Date
}

export const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [10000, 'Comment content cannot exceed 10000 characters']
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment creator is required']
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)

export default mongoose.model<IComment>('Comment', CommentSchema)
