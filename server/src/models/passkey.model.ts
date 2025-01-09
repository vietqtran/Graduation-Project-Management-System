import { Schema } from 'mongoose'

export interface IPasskey extends Document {
  aaguid: string
  user_id: string
  credential_id: string
  credential_type: string
  public_key: string
  counter: number
  transports: string[]
  name?: string
}

export const PasskeySchema = new Schema<IPasskey>(
  {
    aaguid: { type: String, required: true },
    user_id: { type: String, required: true },
    credential_id: { type: String, required: true },
    credential_type: { type: String, required: true },
    public_key: { type: String, required: true },
    counter: { type: Number, required: true },
    transports: { type: [String], required: true },
    name: { type: String, required: false }
  },
  {
    timestamps: false,
    versionKey: false
  }
)
