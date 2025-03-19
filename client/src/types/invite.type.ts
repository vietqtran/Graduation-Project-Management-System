import { User } from './user.type'
import { Project } from './project.type'
export interface Invite {
  _id: string
  from_user: User
  to_user: User
  project: Project
  status: string
  created_at?: Date
  updated_at?: Date
}
