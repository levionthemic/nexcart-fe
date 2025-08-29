import { HttpError } from "@/lib/http"
import { clearCart } from "@/redux/cart/cartSlice"

import { AppStore } from '@/redux/store'
import { logoutUserAction } from "@/redux/user/userSlice"

let reduxStore: AppStore = null as unknown as AppStore
export const injectStore = (store: AppStore) => { reduxStore = store }

export const asyncHandler = async <T>(promise: Promise<T>) => {
  try {
    return await promise
  } catch (err) {
    if (err instanceof HttpError && err.status === 401) { 
      reduxStore.dispatch(logoutUserAction())
      reduxStore.dispatch(clearCart())
    }
    return Promise.reject(err)
  }
}
