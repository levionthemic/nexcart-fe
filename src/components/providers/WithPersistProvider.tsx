'use client'

import { store } from '@/redux/store'
import React from 'react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import Loader from '../loader/loader'

const persistor = persistStore(store)

export default function WithPersistProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Loader />}>
        {children}
      </PersistGate>
    </Provider>
  )
}
