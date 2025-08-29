'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type LoadingContextType = {
  apiLoadingCount: number
  startLoading: () => void
  endLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

type LoadingProviderProps = {
  children: ReactNode
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [apiLoadingCount, setApiLoadingCount] = useState(0)

  const startLoading = () => setApiLoadingCount((count) => count + 1)
  const endLoading = () => setApiLoadingCount((count) => Math.max(0, count - 1))

  return (
    <LoadingContext.Provider
      value={{
        apiLoadingCount,
        startLoading,
        endLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
