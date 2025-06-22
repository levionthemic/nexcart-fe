'use client'

import { Provider } from 'react-redux'
import { store } from '@/redux/store'

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import { injectStore } from '@/utils/authorizedAxios'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { LoadingProvider } from '@/contexts/LoadingContext'
import envConfig from '@/config'

const persistor = persistStore(store)
injectStore(store)

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GoogleOAuthProvider clientId={envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <LoadingProvider>{children}</LoadingProvider>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  )
}
