import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IResource extends Document {
  key: string
  url: string
  provider: string
  type: string
}

export const ResourceSchema = new Schema<IResource>(
  {
    key: { type: String, required: true },
    url: { type: String, required: true },
    provider: { type: String },
    type: { type: String }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    versionKey: false
  }
)

const ResourceModel: Model<IResource> = mongoose.model<IResource>('Resource', ResourceSchema)
export default ResourceModel
