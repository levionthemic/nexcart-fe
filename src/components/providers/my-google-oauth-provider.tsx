'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'

import envConfig from '@/config'

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
