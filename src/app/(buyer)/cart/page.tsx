import WithPersistProvider from '@/components/providers/WithPersistProvider'
import React from 'react'
import ClientCartPage from './cart-page'

export default function CartPage() {
  return (
    <WithPersistProvider>
      <ClientCartPage />
    </WithPersistProvider>
  )
}
