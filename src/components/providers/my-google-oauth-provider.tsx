'use client'

import envConfig from '@/config'
import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'

export default function MyGoogleOAuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <GoogleOAuthProvider clientId={envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  )
}
