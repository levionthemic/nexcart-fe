import { TokenResponse } from '@react-oauth/google'
import { Role, RoleValue } from '@/types/enums/role'
import http from '@/lib/http'

const AUTH_API_PREFIX = '/auth'

export type LoginPayload =
  | {
      email: string
      password: string
      role: Role
      access_token?: string
      remember_me?: boolean
    }
  | Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>

export interface LoginResponse {
  access_token: string
  session_id: string
  remember_me: boolean
}

export const loginUserApi = async (data: LoginPayload) => {
  let response
  if (data.access_token) {
    response = await http.post<LoginResponse>(`${AUTH_API_PREFIX}/login/google/callback`, data)
  } else {
    response = await http.post<LoginResponse>(`${AUTH_API_PREFIX}/login`, data)
  }
  return response.data
}

export const logoutUserApi = async () => {
  return await http.delete(`${AUTH_API_PREFIX}/logout`)
}

export const registerUserApi = async (data: {
  email: string
  password: string
  role: RoleValue
}): Promise<{ email: string }> => {
  const response = await http.post<{ email: string }>(
    `${AUTH_API_PREFIX}/register`,
    data
  )

  return response.data
}

export const registerWithGoogleApi = async (
  data:
    | { access_token: string }
    | Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>
) => {
  const response = await http.post(
    `${AUTH_API_PREFIX}/register/google/callback`,
    data
  )
  return response.data
}

export const verifyUserApi = async (data: {
  email: string
  token: string
  role: Role
}) => {
  const response = await http.put(`${AUTH_API_PREFIX}/verify-account`, data)
  return response.data
}

export const refreshTokenApi = async () => {
  await http.get(`${AUTH_API_PREFIX}/refresh-token`, {
    credentials: 'include'
  })
}

export const forgotPasswordApi = async (data: { email: string }) => {
  const response = await http.post(`${AUTH_API_PREFIX}/forgot-password`, data)
  return response.data
}

export const verifyOtpApi = async (data: {
  email: string
  otp_code: string
}) => {
  const response = await http.post<{ reset_token: string }>(
    `${AUTH_API_PREFIX}/otp-verify`,
    data
  )
  return response.data
}

export const resetPasswordApi = async (data: {
  reset_token: string | null
  password: string
}) => {
  const response = await http.put(`${AUTH_API_PREFIX}/reset-password`, data)
  return response.data
}
