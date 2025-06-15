import { configureStore } from '@reduxjs/toolkit'

import { cartReducer } from '@/redux/cart/cartSlice'
import { userReducer } from '@/redux/user/userSlice'

import { combineReducers } from 'redux'
import { PersistConfig, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootPersistConfig: PersistConfig<ReturnType<typeof reducers>> = {
  key: 'root',
  storage: storage,
  whitelist: ['user', 'cart']
}

const reducers = combineReducers({
  cart: cartReducer,
  user: userReducer
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
