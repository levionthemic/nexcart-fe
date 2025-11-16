import { configureStore } from '@reduxjs/toolkit'

import { cartReducer } from '@/redux/cart/cartSlice'
import { userReducer } from '@/redux/user/userSlice'
import { notificationReducer } from '@/redux/notification/notificationSlice'

import { combineReducers } from 'redux'
import { PersistConfig, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Create a noop storage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    }
  }
}

// Use noop storage on server, regular storage on client
const persistStorage = typeof window !== 'undefined' ? storage : createNoopStorage()

const rootPersistConfig: PersistConfig<ReturnType<typeof reducers>> = {
  key: 'root',
  storage: persistStorage,
  whitelist: ['user', 'cart', 'notification']
}

const reducers = combineReducers({
  cart: cartReducer,
  user: userReducer,
  notification: notificationReducer
})

const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
})

export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
