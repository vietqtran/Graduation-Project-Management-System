export interface User {
  id: string
  name: string
  email: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
}

export interface RootState {
  auth: AuthState
}
