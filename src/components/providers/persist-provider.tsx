'use client'

import { store } from '@/redux/store'
import React from 'react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import Loader from '../loader/loader'
import { injectStore } from '@/utils/asyncHandler'

const persistor = persistStore(store)

export default function PersistProvider({
  children
}: {
  children: React.ReactNode
}) {
  injectStore(store)
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Loader />}>
        {children}
      </PersistGate>
    </Provider>
  )
}
