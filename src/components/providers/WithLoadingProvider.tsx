'use client'

import { LoadingProvider } from '@/contexts/LoadingContext'
import React from 'react'

export default function WithLoadingProvider({
  children
}: {
  children: React.ReactNode
}) {
  return <LoadingProvider>{children}</LoadingProvider>
}
