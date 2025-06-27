'use client'

import { Button } from '@/components/ui/button'

import { cloneDeep } from 'lodash'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useId } from 'react'
import creditCardLogo from '@/assets/credit-card-black-logo.png'
import momoLogo from '@/assets/momo-logo.png'
import vnpayLogo from '@/assets/vnpay-logo.png'
import { FaMoneyBillAlt } from 'react-icons/fa'
import Image from 'next/image'
import { useOrder } from '@/contexts/order-context'
import { PaymentMethod } from '@/types/enums/checkout'
import { useRouter } from 'next/navigation'
import RightSidebar from './_components/right-sidebar'
import CreditForm from './_components/credit-form'

export default function Payment() {
  const { clusterOrders, checkoutInfo, setCheckoutInfo } = useOrder()
  const router = useRouter()

  const [payments, setPayments] = useState(
    [...Array(clusterOrders.length)].map(() => ({
      type: PaymentMethod.COD,
      detail: {}
    }))
  )

  const handleChoosePaymentMethod = (paymentMethod: string, index: number) => {
    let type: PaymentMethod
    switch (paymentMethod) {
      case PaymentMethod.MOMO:
        type = PaymentMethod.MOMO
        break
      case PaymentMethod.CREDIT:
        type = PaymentMethod.CREDIT
        break
      case PaymentMethod.VNPAY:
        type = PaymentMethod.VNPAY
        break
      default:
        type = PaymentMethod.COD
        break
    }
    setPayments((prevState) => {
      const newState = cloneDeep(prevState)
      newState[index] = { type: type, detail: {} }
      return newState
    })
  }

  const handleBack = () => {
    const oldCheckoutInfo = cloneDeep(checkoutInfo)!
    delete oldCheckoutInfo.payment
    setCheckoutInfo(oldCheckoutInfo)
    router.back()
  }

   const handleUpdatePayment = () => {
    setCheckoutInfo({
      ...checkoutInfo,
      payment: payments
    })
    router.push('/checkout/4')
  }

  const id = useId()

  return (
    <div>
      <div className='text-red-400 font-semibold mt-4 mb-10'>
        Lưu ý: Đơn hàng của bạn có thể được TÁCH thành nhiều đơn hàng nhỏ theo
        chính sách của chúng tôi!
      </div>
      {clusterOrders?.map((clusterOrder, index) => (
        <div key={index} className='grid grid-cols-12 gap-12'>
          <div className='border-[2px] border-b-[#ddd] rounded-md p-4 col-span-9'>
            <div className='font-semibold text-xl text-mainColor1-800'>
              Đơn hàng {index + 1}
            </div>
            <Separator className='mt-1 mb-4' />

            <div className='mb-10'>
              <div className='text-mainColor1-600 font-medium text-lg mb-2'>
                Phương thức thanh toán
              </div>
              <RadioGroup
                className='gap-2'
                defaultValue={PaymentMethod.COD}
                onValueChange={(value) => {
                  handleChoosePaymentMethod(value, index)
                }}
              >
                <div className='border-input has-[:checked]:border-mainColor1-200 has-[:checked]:bg-mainColor1-100/20 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none'>
                  <RadioGroupItem
                    value={PaymentMethod.COD}
                    id={`${id}-1`}
                    aria-describedby={`${id}-1-description`}
                    className='order-1 after:absolute after:inset-0'
                  />
                  <div className='flex grow items-center gap-3'>
                    <FaMoneyBillAlt className='text-3xl text-green-600' />
                    <div className='grid grow gap-2'>
                      <Label htmlFor={`${id}-1`}>
                        Thanh toán bằng tiền mặt{' '}
                        <span className='text-muted-foreground text-xs leading-[inherit] font-normal'>
                          (COD)
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>

                <div className='border-input has-[:checked]:border-mainColor1-200 has-[:checked]:bg-mainColor1-100/20 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none'>
                  <RadioGroupItem
                    value={PaymentMethod.MOMO}
                    id={`${id}-2`}
                    aria-describedby={`${id}-2-description`}
                    className='order-1 after:absolute after:inset-0'
                  />
                  <div className='flex grow items-start gap-3'>
                    <Image src={momoLogo} alt='' width={30} height={30} />
                    <div className='grid grow gap-2'>
                      <Label htmlFor={`${id}-2`}>Thanh toán qua ví Momo </Label>
                      <p
                        id={`${id}-2-description`}
                        className='text-muted-foreground text-xs'
                      >
                        Đảm bảo tài khoản của bạn đã liên kết với ví Momo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='border-input has-[:checked]:border-mainColor1-200 has-[:checked]:bg-mainColor1-100/20 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none'>
                  <RadioGroupItem
                    value={PaymentMethod.VNPAY}
                    id={`${id}-3`}
                    aria-describedby={`${id}-3-description`}
                    className='order-1 after:absolute after:inset-0'
                  />
                  <div className='flex grow items-start gap-3'>
                    <Image src={vnpayLogo} alt='' width={30} height={30} />
                    <div className='grid grow gap-2'>
                      <Label htmlFor={`${id}-3`}>Thanh toán qua VNPAY </Label>
                      <p
                        id={`${id}-3-description`}
                        className='text-muted-foreground text-xs'
                      >
                        Đảm bảo tài khoản của bạn đã liên kết với VNPAY.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='border-input has-[:checked]:border-mainColor1-200 has-[:checked]:bg-mainColor1-100/20 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none'>
                  <RadioGroupItem
                    value={PaymentMethod.CREDIT}
                    id={`${id}-4`}
                    aria-describedby={`${id}-4-description`}
                    className='order-4 after:absolute after:inset-0'
                  />
                  <div className='flex grow items-start gap-3'>
                    <Image src={creditCardLogo} alt='' width={30} height={30} />
                    <div className='grid grow gap-2'>
                      <Label htmlFor={`${id}-4`}>
                        Thanh toán bằng thẻ tín dụng{' '}
                        <span className='text-muted-foreground text-xs leading-[inherit] font-normal'>
                          (Credit card)
                        </span>
                      </Label>
                      <p
                        id={`${id}-1-description`}
                        className='text-muted-foreground text-xs'
                      >
                        Cần điền đầy đủ thông tin bên dưới.
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {payments[index].type === PaymentMethod.CREDIT ? (
              <CreditForm />
            ) : (
              <div className='grid grid-cols-2 gap-5'>
                <Button
                  type='button'
                  className='border bg-white text-mainColor1-600  border-mainColor1-600 hover:bg-white text-md font-semibold rounded-lg hover:drop-shadow-xl'
                  onClick={handleBack}
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleUpdatePayment}
                  className='bg-mainColor1-600 hover:bg-mainColor1-800 text-white text-md font-semibold rounded-lg hover:drop-shadow-xl'
                >
                  Tiếp tục
                </Button>
              </div>
            )}
          </div>
          <div className='col-span-3'>
            <RightSidebar
              clusterOrder={clusterOrder}
              checkoutInfo={checkoutInfo}
              index={index}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
