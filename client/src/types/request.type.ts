import { UploadDocument } from './document.type'
import { User } from './user.type'

export interface Request {
  _id: string
  to_user: User
  from_user: User
  approve_user: User
  status: string
  remark: string
  type: string
  description: string
  documents: UploadDocument[]
  due_date: string
  created_at: string
  updated_at: string
}
