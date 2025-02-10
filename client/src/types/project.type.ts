import { Campus } from './campus.type'
import { Field } from './field.type'
import { History } from './history.type'
import { Major } from './major.type'
import { Task } from './task.type'
import { User } from './user.type'

export enum ProjectCategory {
  Student = 1,
  Teacher = 2
}

export interface Project {
  _id: string
  name: string
  description?: string
  members: User[]
  leader: User
  supervisor: User[]
  major: Major[]
  field: Field[]
  campus: Campus
  mark?: number
  histories: History[]
  category: ProjectCategory
  tasks: Task[]
  status: number
  stage: number
  slow_count: number
  created_at: Date
  updated_at: Date
}

export interface ProjectListItem
  extends Pick<Project, '_id' | 'name' | 'description' | 'status' | 'stage' | 'category'> {
  leader: {
    _id: string
    name: string
  }
  members_count: number
}
