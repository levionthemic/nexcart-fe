/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import Confirmation from './confirmation'
import Information from './information'
import Payment from './payment'
import Shipping from './shipping'

export default async function CheckoutStepPage({ params }: any) {
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
