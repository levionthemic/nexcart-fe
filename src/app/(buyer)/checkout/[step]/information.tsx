/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useOrder } from '@/contexts/order-context'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { Address } from '@/types/entities/address'
import { getAddressString } from '@/utils/helpers'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PHONE_NUMBER_RULE,
  PHONE_NUMBER_RULE_MESSAGE
} from '@/utils/validators'

const formSchema = z.object({
  name: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  email: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
    .regex(EMAIL_RULE, { message: EMAIL_RULE_MESSAGE }),
  phone: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
    .regex(PHONE_NUMBER_RULE, { message: PHONE_NUMBER_RULE_MESSAGE }),
  defaultBuyerAddressId: z.number().int({ message: FIELD_REQUIRED_MESSAGE })
})

export type InformationFormSchemaType = z.infer<typeof formSchema>

export type InformationType = Omit<
  InformationFormSchemaType,
  'defaultBuyerAddressId'
> & {
  buyerAddress: Address & { shortAddress: string }
}

export default function Information() {
  const currentUser = useSelector(selectCurrentUser)
  const router = useRouter()

  const { checkoutInfo, setCheckoutInfo, orderItems } = useOrder()

  console.log(orderItems)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (checkoutInfo) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [checkoutInfo])

  const form = useForm<InformationFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultBuyerAddressId:
        checkoutInfo?.information?.buyerAddress.id ||
        currentUser?.buyer?.addresses.find((a) => a.is_default)?.id,
      email: checkoutInfo?.information?.email || currentUser?.email || '',
      name: checkoutInfo?.information?.name || currentUser?.buyer?.name || '',
      phone: checkoutInfo?.information?.phone || currentUser?.phone || ''
    }
  })

  const [buyerAddresses, setBuyerAddresses] = useState<
    { id: number; addressString: string }[]
  >([])
  useEffect(() => {
    if (currentUser?.buyer?.addresses)
      Promise.all<string>(
        currentUser.buyer.addresses.map((addr) => getAddressString(addr))
      ).then((addressStrings) => {
        setBuyerAddresses(
          addressStrings.map((addressString, index) => ({
            id: Number(currentUser.buyer?.addresses[index].id),
            addressString: addressString
          }))
        )
      })
  }, [])

  const handleUpdateUser = (data: InformationFormSchemaType) => {
    const { defaultBuyerAddressId, ...rest } = data
    const buyerAddress = currentUser?.buyer?.addresses.find(
      (a) => a.id === defaultBuyerAddressId
    )
    const shortAddress = buyerAddresses.find(
      (a) => a.id === defaultBuyerAddressId
    )!.addressString
    const updatedCheckoutInfo = {
      information: { ...rest, buyerAddress: { ...buyerAddress!, shortAddress } }
    }

    setCheckoutInfo(updatedCheckoutInfo)
    router.push('/checkout/2')
  }

  return (
    <div className='my-6 w-[95%] rounded-md border border-b-[#ddd] p-4'>
      <div className='text-mainColor1-600 text-lg font-medium'>
        Thông tin người nhận
      </div>
      <p className='text-muted-foreground mb-4 text-sm'>
        Mặc định sẽ lấy thông tin cá nhân trong tài khoản của bạn. Bạn có thể
        thay đổi chúng nếu muốn.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateUser)}
          className='space-y-8'
        >
          <div className='grid grid-cols-3 gap-14'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Họ và tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Vd: Nguyễn Văn A'
                      className={`placeholder:text-opacity-50 border-mainColor1-100/50 rounded-xl border placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
                        !!form.formState.errors['name'] && 'border-red-500'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=''>
                    Họ và tên này sẽ được in trên đơn vận chuyển.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Vd: example@levionthemic.com'
                      className={`placeholder:text-opacity-50 border-mainColor1-100/50 rounded-xl border placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
                        !!form.formState.errors['email'] && 'border-red-500'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=''>
                    Email này sẽ được in trên đơn vận chuyển.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Vd: 0123456789'
                      className={`placeholder:text-opacity-50 border-mainColor1-100/50 rounded-xl border placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
                        !!form.formState.errors['phone'] && 'border-red-500'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=''>
                    Người vận chuyển sẽ liên hệ bạn qua số điện thoại này.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='defaultBuyerAddressId'
            render={({ field }) => (
              <FormItem className='mb-6'>
                <FormLabel>Địa chỉ mặc định</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={String(field.value)}
                >
                  <SelectTrigger className='w-full overflow-hidden'>
                    <SelectValue placeholder='Chọn địa chỉ mặc định' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {buyerAddresses.length ? (
                        buyerAddresses.map((addr) => (
                          <SelectItem key={addr.id} value={String(addr.id)}>
                            {addr.addressString}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key={Math.random()} value='0' disabled>
                          Không có địa chỉ. Hãy thêm địa chỉ!
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 gap-5'>
            <Button
              type='submit'
              className='bg-mainColor1-600 hover:bg-mainColor1-800 text-md rounded-lg font-semibold text-white hover:drop-shadow-xl'
            >
              Tiếp tục
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
