import React from 'react'
import Information from './information'
import WithPersistProvider from '@/components/providers/WithPersistProvider'
import { OrderProvider } from '@/contexts/order-context'
import Shipping from './shipping'

export default async function CheckoutStepPage({
  params
}: {
  params: { step: number }
}) {
  const stepParams = await params
  const step = stepParams.step

  return (
    <WithPersistProvider>
      {step == 1 && <Information />}
      {step == 2 && <Shipping />}
      {step == 3 && (
        <Payment
          clusterOrders={clusterOrders}
          setCheckoutInfo={setCheckoutInfo}
          setStep={setStep}
          checkoutInfo={checkoutInfo}
        />
      )}
      {step == 4 && (
        <Confirmation
          clusterOrders={clusterOrders}
          setStep={setStep}
          checkoutInfo={checkoutInfo}
          handleCheckout={handleCheckout}
        />
      )}
    </WithPersistProvider>
  )
}
