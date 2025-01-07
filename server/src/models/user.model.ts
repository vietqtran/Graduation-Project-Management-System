import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  username: string
  first_name?: string
  last_name?: string
  hashed_password: string
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: false, unique: true },
    first_name: { type: String, required: false, default: null },
    last_name: { type: String, required: false, default: null },
    hashed_password: { type: String, required: true }
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
