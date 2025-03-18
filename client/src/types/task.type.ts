import { User } from './user.type'

export interface Comment {
  _id: string
  content: string
  created_by: User
  created_at: string
  updated_at: string
}

export interface TaskLabel {
  text: string
  color: string
}

export interface Task {
  _id: string
  name: string
  description?: string
  assignees: User[]
  type: 'milestone' | 'task'
  start_date?: string
  due_date?: string
  created_by: User
  labels: TaskLabel[]
  is_completed: boolean
  status: 'todo' | 'in-progress' | 'review' | 'done'
  comments: Comment[]
  resources: string[]
  documents: string[]
  project: string
  column: Column
  position: number
  checklist: {
    title: string
    items: { text: string; is_completed: boolean; created_at: string }[]
  }[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  cover_image?: string
  watched_by: string[]
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface Column {
  _id: string
  title: string
  description?: string
  project: string
  position: number
  created_by: User
  is_archived: boolean
  color?: string
  task_limit?: number
  created_at: string
  updated_at: string
}
