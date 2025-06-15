import { Provider } from 'react-redux'
import { store } from '@/redux/store'

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import { injectStore } from '@/utils/authorizedAxios'

import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { LoadingProvider } from '@/contexts/LoadingContext'

const persistor = persistStore(store)
injectStore(store)

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
          <LoadingProvider>{children}</LoadingProvider>
        </GoogleOAuthProvider>
        <Toaster richColors />
      </PersistGate>
    </Provider>
  )
}
