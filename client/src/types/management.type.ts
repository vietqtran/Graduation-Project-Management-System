interface User {
  _id: string
  email: string
  username: string
  display_name: string
}

// Deadline type definition
interface Deadline {
  _id: string
  deadline_key: 'create_group' | 'create_idea' | 'thesis_defense' // Enum-like restriction
  deadline_date: string // ISO Date String
  semester: string
  created_by: User
  updated_by: User
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
  created_by: User
  updated_by: User
  created_at: string // ISO date string
  updated_at: string // ISO date string
}

export type DeadlinesResponse = Deadline[]
export type ParametersResponse = Parameter[]
