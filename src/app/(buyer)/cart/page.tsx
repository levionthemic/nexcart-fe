import WithPersistProvider from '@/components/providers/WithPersistProvider'
import React from 'react'
import ClientCartPage from './cart-page'
import { OrderProvider } from '@/contexts/order-context'

export default function CartPage() {
  return (
    <WithPersistProvider>
      <OrderProvider>
        <ClientCartPage />
      </OrderProvider>
    </WithPersistProvider>
  )
}
