import { AuthState, User } from '@/types/store.type'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: AuthState = {
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User | null }>) => {
      const { user } = action.payload
      state.user = user
    },
    logout: (state) => {
      state.user = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    }
  }
})

export const { setUser, logout, updateUser } = authSlice.actions
export default authSlice.reducer
