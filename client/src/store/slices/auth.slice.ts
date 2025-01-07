import { AuthState, User } from '@/types/store.type'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      const { user, accessToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    }
  }
})

export const { setCredentials, logout, updateUser } = authSlice.actions
export default authSlice.reducer
