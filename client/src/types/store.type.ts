export interface User {
  _id: string
  email: string
  username: string
  first_name: string
  last_name: string
  roles: string[]
}

export interface AuthState {
  user: User | null
}

export interface RootState {
  auth: AuthState
}
