'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { store } from '@/redux/store'
import { injectStore } from '@/utils/asyncHandler'

import Loader from '../loader/loader'

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
