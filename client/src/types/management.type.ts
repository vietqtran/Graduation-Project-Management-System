import { Field } from './field.type'
import { Major } from './major.type'

export interface UserDto {
  _id: string
  email: string
  username: string
  display_name: string
  avatar?: string
}

// Deadline type definition
interface Deadline {
  _id: string
  deadline_key: 'create_group' | 'create_idea' | 'thesis_defense' // Enum-like restriction
  deadline_date: string // ISO Date String
  semester: string
  created_by: UserDto
  updated_by: UserDto
  created_at: string // ISO Date String
  updated_at: string // ISO Date String
}
// Parameter type definition
interface Parameter {
  _id: string
  param_name: string
  param_value: string
  param_type: 'string' | 'number' | 'boolean' | 'date'
  description?: string
  created_by: UserDto
  updated_by: UserDto
  created_at: string // ISO date string
  updated_at: string // ISO date string
}

export interface Student {
  _id: string
  url: string
  display_name: string
  email: string
  status: number
  code?: string // optional, as not all objects include it
  campus: string
  field: Field[]
  major: Major[]
  project: {
    name: string
    _id: string
  }
  is_leader: boolean
}

export interface Teacher {
  _id: string
  url: string
  display_name: string
  email: string
  status: number
  code?: string
  roles: ('lecturer' | 'supervisor')[]
  campus: string
  major: string[]
  noProjects: number
}

export interface Supervisor {
  _id: string
  display_name: string
  email: string
  username: string
  avatar: string
}

export interface Project {
  _id: string
  name: string
  major: {
    _id: string
    name: string
  }[]
  field: {
    _id: string
    name: string
  }[]
  campus?: string
  mark: number | null
  category: 1 | 2
  status?: number | null
  stage: number
  slow_count: number
  noMembers: number
  supervisor: Supervisor[] | null
  created_by?: UserDto
  updated_by?: UserDto
  created_at: string
  updated_at?: string
}

export interface ProjectsResponse {
  list: Project[]
  total: number
}

export interface StudentsResponse {
  list: Student[]
  total: number
}

export interface TeachersResponse {
  list: Teacher[]
  total: number
}
export type DeadlinesResponse = Deadline[]
export type ParametersResponse = Parameter[]
