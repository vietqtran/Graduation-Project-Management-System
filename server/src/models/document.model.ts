import mongoose, { Document } from 'mongoose'

import { IProject } from './project.model'
import { IUser } from './user.model'

const Schema = mongoose.Schema

export interface IUploadDocument extends Document {
  title: string
  description: string
  file_url: string
  file_type: string
  file_size: number
  user: IUser['_id']
  project_id: IProject['_id']
}

const UploadDocumentSchema = new Schema<IUploadDocument>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    file_url: {
      type: String,
      required: true
    },
    file_type: {
      type: String,
      required: true
    },
    file_size: {
      type: Number,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    project_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Project'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    versionKey: false,
    id: true
  }
)

const UploadDocument = mongoose.model('UploadDocument', UploadDocumentSchema)
export default UploadDocument
