import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ISession extends Document {
  device_id: string
  device?: string
  hashed_access_token: string
  hashed_refresh_token: string
  access_token_expires_at: Date
  refresh_token_expires_at: Date
}

export const SessionSchema = new Schema<ISession>(
  {
    device_id: { type: String, required: false, index: true },
    device: { type: String, required: false, default: 'Unknown' },
    hashed_access_token: { type: String, required: true, index: true },
    hashed_refresh_token: { type: String, required: true, index: true },
    access_token_expires_at: { type: Date, required: true },
    refresh_token_expires_at: { type: Date, required: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    versionKey: false
  }
)

const SessionModel: Model<ISession> = mongoose.model<ISession>('Session', SessionSchema)
export default SessionModel
