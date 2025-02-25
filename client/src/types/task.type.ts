export enum TaskType {
  Milestone = 'milestone',
  Task = 'task'
}

export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in-progress',
  Review = 'review',
  Done = 'done'
}

export interface Task {
  _id: string
  name: string
  description?: string
  assignees: {
    _id: string
    name: string
    avatar?: string
  }[]
  type: TaskType
  start_date?: Date
  due_date?: Date
  created_by: {
    _id: string
    name: string
    avatar?: string
  }
  labels: string[]
  is_completed: boolean
  status: TaskStatus
  comments: Comment[]
  resources: {
    _id: string
    name: string
    url: string
  }[]
  column_id: string
  created_at: Date
  updated_at: Date
}
