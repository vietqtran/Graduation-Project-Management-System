import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  username: string
  hashed_password: string
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    hashed_password: { type: String, required: true }
  },
  { timestamps: true, versionKey: false }
)

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema)
export default UserModel
