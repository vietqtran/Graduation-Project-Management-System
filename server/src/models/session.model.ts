import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ISession extends Document {
  device_id: string
  device?: string
  access_token: string
  refresh_token: string
  access_token_expires_at: Date
  refresh_token_expires_at: Date
}

export const SessionSchema = new Schema<ISession>(
  {
    device_id: { type: String, required: false, default: 'Unknown', index: true },
    device: { type: String, required: false, default: 'Unknown' },
    access_token: { type: String, required: true, index: true },
    refresh_token: { type: String, required: true, index: true },
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
