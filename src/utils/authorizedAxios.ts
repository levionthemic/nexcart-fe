import axios from 'axios'
import { toast } from 'sonner'
import { refreshTokenAPI } from '@/apis/auth.api'
import { logoutUserAPI } from '@/redux/user/userSlice'
import { API_ROOT } from '@/utils/constants'
import { clearCart } from '@/redux/cart/cartSlice'
import { EnhancedStore } from '@reduxjs/toolkit'
import { AppStore } from '@/redux/store'

const authorizedAxiosInstance = axios.create({
  baseURL: `${API_ROOT}`,
  timeout: 1000 * 60 * 10,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

let axiosReduxStore: AppStore
export const injectStore = (mainStore: EnhancedStore) => (axiosReduxStore = mainStore)

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let refreshTokenPromise: Promise<unknown | null> | null
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(clearCart())
      axiosReduxStore.dispatch(logoutUserAPI())
    }

    console.log(error)

    const originalRequests = error.config
    if (error?.response?.status === 410 && originalRequests) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            return data?.accessToken
          })
          .catch((_error) => {
            axiosReduxStore.dispatch(clearCart())
            axiosReduxStore.dispatch(logoutUserAPI())
            return Promise.reject(_error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }
      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequests)
      })
    }

    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message)
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
