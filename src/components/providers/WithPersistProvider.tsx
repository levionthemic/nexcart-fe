'use client'

import { store } from '@/redux/store'
import { injectStore } from '@/utils/authorizedAxios'
import React from 'react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

const persistor = persistStore(store)
injectStore(store)

function Loading() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='text-center'>
        <div className='w-10 h-10 border-4 border-mainColor1-800 border-t-transparent rounded-full animate-spin mx-auto' />
        <p className='mt-2 text-sm text-gray-500'>Đang tải dữ liệu...</p>
      </div>
    </div>
  )
}

export default function WithPersistProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Loading />}>{children}</PersistGate>
    </Provider>
  )
}
