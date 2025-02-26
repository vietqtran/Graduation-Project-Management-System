import { Types } from 'mongoose'

export interface CreateDocumentDto {
  title: string
  description?: string
  file_url: string
  file_type: string
  file_size: number
  user: string | Types.ObjectId
  project_id: string | Types.ObjectId
}

export interface UpdateDocumentDto {
  title?: string
  description?: string
  file_url?: string
  file_type?: string
  file_size?: number
}
