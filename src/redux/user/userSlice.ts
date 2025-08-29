import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { User } from '@/types/entities/user'
import { Address } from '@/types/entities/address'
import http from '@/lib/http'
import { LoginPayload, loginUserApi, logoutUserApi } from '@/apis/auth.api'

//  Define types
interface UserState {
  currentUser: User | null
}

//  Define payload types
type UpdatePayload = {
  name?: string
  phone?: string
  buyer_address?: Address
  default_buyer_address_id?: number
}

//  Async Thunks
export const loginUserAction = createAsyncThunk<unknown, LoginPayload>(
  'user/loginUserAction',
  async (userData) => {
    try {
      await loginUserApi(userData)
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const logoutUserAction = createAsyncThunk<unknown>(
  'user/logoutUserAction',
  async () => {
    try {
      await logoutUserApi()
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const updateUserAction = createAsyncThunk<
  User,
  FormData | UpdatePayload
>('user/updateUserAction', async (data) => {
  const response = await http.put<User>('/users/profile', data, {
    credentials: 'include'
  })
  return response.data as User
})

// 🔵 Slice
const initialState: UserState = {
  currentUser: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUserAction.fulfilled, (state) => {
      state.currentUser = null
    })
    builder.addCase(
      updateUserAction.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload
      }
    )
  }
})

// 🔵 Selectors
export const selectCurrentUser = (state: RootState) => {
  return state.user.currentUser
}

export const { setUser } = userSlice.actions

// 🟢 Export reducer
export const userReducer = userSlice.reducer
