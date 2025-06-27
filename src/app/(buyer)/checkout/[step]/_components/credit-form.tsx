'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/validators'
import { useOrder } from '@/contexts/order-context'
import { cloneDeep } from 'lodash'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  creditName: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  creditNumber: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  creditExpireDay: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  creditCvv: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
})

export type CreditFormSchemaType = z.infer<typeof formSchema>
export default function CreditForm() {
  const router = useRouter()
  const { checkoutInfo, setCheckoutInfo } = useOrder()
  const form = useForm<CreditFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creditName: '',
      creditNumber: '',
      creditExpireDay: '',
      creditCvv: ''
    }
  })
  const handleUpdatePayment = (data: CreditFormSchemaType) => {
    console.log(data)
    router.push('/checkout/4')
  }
  const handleBack = () => {
    const oldCheckoutInfo = cloneDeep(checkoutInfo)!
    delete oldCheckoutInfo.payment
    setCheckoutInfo(oldCheckoutInfo)
    router.back()
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdatePayment)}
        className='space-y-8'
      >
        <div className='text-mainColor1-600 font-medium text-lg mb-2'>
          Chi tiết thanh toán
        </div>
        <FormField
          control={form.control}
          name='creditName'
          render={({ field }) => (
            <FormItem className='mb-4'>
              <FormLabel>Tên trên thẻ</FormLabel>
              <FormControl>
                <Input className='' {...field} />
              </FormControl>
              <FormDescription>
                Điền đúng họ và tên trên thẻ tín dụng của bạn.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='creditNumber'
          render={({ field }) => (
            <FormItem className='mb-4'>
              <FormLabel>Số thẻ</FormLabel>
              <FormControl>
                <Input className='' {...field} />
              </FormControl>
              <FormDescription>
                Điền đúng số thẻ trên thẻ tín dụng của bạn.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='creditExpireDay'
            render={({ field }) => (
              <FormItem className='mb-4'>
                <FormLabel>Ngày hết hạn</FormLabel>
                <FormControl>
                  <Input className='' {...field} />
                </FormControl>
                <FormDescription>
                  Điền đúng ngày hết hạn trên thẻ tín dụng của bạn.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='creditCvv'
            render={({ field }) => (
              <FormItem className='mb-4'>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input className='' {...field} />
                </FormControl>
                <FormDescription>
                  Điền đúng CVV trên thẻ tín dụng của bạn.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-5'>
          <Button
            type='button'
            className='border bg-white text-mainColor1-600  border-mainColor1-600 hover:bg-white text-md font-semibold rounded-lg hover:drop-shadow-xl'
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Button
            type='submit'
            className='bg-mainColor1-600 hover:bg-mainColor1-800 text-white text-md font-semibold rounded-lg hover:drop-shadow-xl'
          >
            Tiếp tục
          </Button>
        </div>
      </form>
    </Form>
  )
}
