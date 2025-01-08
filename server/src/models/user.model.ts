import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  username: string
  first_name: string
  last_name: string
  roles?: [string]
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true, maxlength: 255 },
    username: { type: String, required: false, unique: true, index: true, maxlength: 50 },
    first_name: { type: String, required: true, default: '', maxlength: 50 },
    last_name: { type: String, required: true, default: '', maxlength: 50 },
    roles: { type: Array, required: true, default: ['user'] }
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
