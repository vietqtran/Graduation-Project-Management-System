import { IPasskey, PasskeySchema } from './passkey.model'
import mongoose, { Document, Model, Schema } from 'mongoose'

import { ACCOUNT_STATUS } from '@/constants/status'
import { ISession } from './session.model'
import { IUser } from './user.model'

export interface IAccount extends Document {
  user_id: string
  user: IUser
  email: string
  username: string
  hashed_password: string
  sessions: ISession['_id'][]
  passkeys: IPasskey[]
  google_id?: string
  status: number
}

const AccountSchema = new Schema<IAccount>(
  {
    user_id: { type: String, required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    email: { type: String, required: true, unique: true, index: true, maxlength: 255 },
    username: { type: String, required: false, unique: true, index: true, maxlength: 50 },
    hashed_password: { type: String, required: true },
    google_id: { type: String, required: false, default: null },
    status: { type: Number, enum: ACCOUNT_STATUS, required: false, default: ACCOUNT_STATUS.ACTIVATED },
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
