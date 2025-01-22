import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUser } from './user.model'

export interface IComment extends Document {
  created_by: IUser['_id']
  content: string
}

export const CommentSchema = new Schema<IComment>(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment creator is required']
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [1, 'Comment cannot be empty'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
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

const CommentModel: Model<IComment> = mongoose.model<IComment>('Comment', CommentSchema)
export default CommentModel
