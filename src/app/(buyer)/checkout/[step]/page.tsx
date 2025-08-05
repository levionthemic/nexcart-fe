import React from 'react'
import Information from './information'
import Shipping from './shipping'
import Payment from './payment'
import Confirmation from './confirmation'

export default async function CheckoutStepPage({
  params
}: {
  params: { step: number }
}) {
  const stepParams = await params
  const step = stepParams.step

  return (
    <div>
      {step == 1 && <Information />}
      {step == 2 && <Shipping />}
      {step == 3 && <Payment />}
      {step == 4 && <Confirmation />}
    </div>
  )
}
