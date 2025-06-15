import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '@/utils/authorizedAxios'
import { RootState } from '../store'
import { User } from '@/types/entities/user'
import { TokenResponse } from '@react-oauth/google'
import { Role } from '@/types/enums/role'

//  Define types
interface UserState {
  currentUser: User | null
}

//  Define payload types
type LoginPayload =
  | {
      email: string
      password: string
      access_token?: string
      rememberMe?: boolean
    }
  | Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>

interface UpdatePayload {
  role?: string
}

//  Async Thunks
export const loginUserAPI = createAsyncThunk<User, LoginPayload>(
  'user/loginUserAPI',
  async (userData) => {
    let response
    if (userData.access_token) {
      response = await authorizedAxiosInstance.post(
        '/auth/login/google/callback',
        userData
      )
    } else {
      response = await authorizedAxiosInstance.post('/auth/login', userData)
    }
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk<void>(
  'user/logoutUserAPI',
  async () => {
    await authorizedAxiosInstance.delete('/auth/logout')
  }
)

export const updateUserAPI = createAsyncThunk<User, FormData | UpdatePayload>(
  'user/updateUserAPI',
  async (data) => {
    const role =
      (data as UpdatePayload).role || (data as FormData).get('role')?.toString()

    let response
    if (role === Role.Buyer) {
      if (data instanceof FormData) {
        data.delete('role')
      } else {
        delete (data as UpdatePayload)['role']
      }
      response = await authorizedAxiosInstance.put(
        '/buyer/profile/update',
        data
      )
    } else if (role === Role.Seller) {
      if (data instanceof FormData) {
        data.delete('role')
      } else {
        delete (data as UpdatePayload)['role']
      }
      response = await authorizedAxiosInstance.put(
        '/seller/profile/update',
        data
      )
    } else {
      throw new Error('Invalid role')
    }

    return response.data
  }
)

// 🔵 Slice
const initialState: UserState = {
  currentUser: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      loginUserAPI.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload
      }
    )
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
    builder.addCase(
      updateUserAPI.fulfilled,
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

// 🟢 Export reducer
export const userReducer = userSlice.reducer
