import mongoose, { Document, Model, Schema } from 'mongoose'
import { ISession } from './session.model'
import { IPasskey, PasskeySchema } from './passkey.model'

export interface IAccount extends Document {
  user_id: string
  email: string
  username: string
  hashed_password: string
  sessions: ISession['_id'][]
  passkeys: IPasskey[]
}

const AccountSchema = new Schema<IAccount>(
  {
    user_id: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true, maxlength: 255 },
    username: { type: String, required: false, unique: true, index: true, maxlength: 50 },
    hashed_password: { type: String, required: true },
    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        default: []
      }
    ],
    passkeys: [
      {
        type: PasskeySchema,
        default: []
      }
    ]
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    versionKey: false
  }
)

const AccountModel: Model<IAccount> = mongoose.model<IAccount>('Account', AccountSchema)
export default AccountModel
