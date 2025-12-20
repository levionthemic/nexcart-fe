'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
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
import { AppDispatch } from '@/redux/store'
import {
  selectCurrentUser,
  setUser,
  updateUserAction
} from '@/redux/user/userSlice'
import { getAddressString } from '@/utils/helpers'
import {
  FIELD_REQUIRED_MESSAGE,
  PHONE_NUMBER_RULE,
  PHONE_NUMBER_RULE_MESSAGE
} from '@/utils/validators'

import AddAddress from '../_components/add-address'

const LeftFormSchema = z.object({
  phone: z
    .string()
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
    .regex(PHONE_NUMBER_RULE, { message: PHONE_NUMBER_RULE_MESSAGE }),

  name: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }),
  default_buyer_address_id: z.string({ message: FIELD_REQUIRED_MESSAGE })
})

type LeftFormSchemaType = z.infer<typeof LeftFormSchema>

export default function ProfileLeftForm() {
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectCurrentUser)

  const [renderCount, setRenderCount] = useState(0)
  const triggerRender = () => setRenderCount((prev) => prev + 1)

  useLayoutEffect(() => {
    fetch('/api/me', {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((userData) => {
        dispatch(setUser(userData))
        triggerRender()
      })
  }, [dispatch])

  const leftForm = useForm<LeftFormSchemaType>({
    resolver: zodResolver(LeftFormSchema),
    defaultValues: {
      phone: currentUser?.phone || '',
      name: currentUser?.buyer?.name || '',
      default_buyer_address_id: String(
        currentUser?.buyer?.addresses.find((a) => a.is_default)?.id ?? '0'
      )
    }
  })

  const [buyerAddresses, setBuyerAddresses] = useState<
    { id: string; addressString: string }[]
  >([])
  useLayoutEffect(() => {
    if (currentUser?.buyer?.addresses)
      Promise.all<string>(
        currentUser.buyer.addresses.map((addr) => getAddressString(addr))
      ).then((addressStrings) => {
        setBuyerAddresses(
          addressStrings.map((addressString, index) => ({
            id: String(currentUser.buyer?.addresses[index].id),
            addressString: addressString
          }))
        )
      })
  }, [renderCount, currentUser])

  const handleLeftFormSubmit = (data: LeftFormSchemaType) => {
    toast.promise(
      dispatch(
        updateUserAction({
          ...data,
          default_buyer_address_id: Number(data.default_buyer_address_id)
        })
      ).unwrap(),
      {
        loading: 'Đang cập nhật...',
        success: () => 'Cập nhật thành công!',
        error: (err) => err.message || 'Cập nhật thất bại!'
      }
    )
  }

  return (
    <div className='relative'>
      <Form {...leftForm}>
        <form
          action='#'
          onSubmit={leftForm.handleSubmit(handleLeftFormSubmit)}
          className='w-full space-y-4'
        >
          <FormField
            control={leftForm.control}
            name='name'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <div>
                  <FormLabel className='text-base'>Họ và tên</FormLabel>
                  <FormDescription>
                    Mặc định chúng tôi sẽ lấy họ và tên này in trên đơn hàng.
                  </FormDescription>
                </div>
                <FormControl>
                  <Input
                    className={`placeholder:text-opacity-50 rounded-full border-[1px] placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
                      !!leftForm.formState.errors['name'] && 'border-red-500'
                    }`}
                    placeholder='Vd: Nguyễn Văn A'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={leftForm.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <div className=''>
                  <FormLabel className='text-base'>Số điện thoại</FormLabel>
                  <FormDescription>
                    Số điện thoại này được dùng để liên lạc với người vận
                    chuyển.
                  </FormDescription>
                </div>
                <FormControl>
                  <Input
                    placeholder='VD: 0123456789'
                    className={`placeholder:text-opacity-5 rounded-full border-[1px] placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
                      !!leftForm.formState.errors['phone'] && 'border-red-500'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={leftForm.control}
            name='default_buyer_address_id'
            render={({ field }) => (
              <FormItem className='mb-6'>
                <FormLabel>Địa chỉ mặc định</FormLabel>
                {buyerAddresses.length ? (
                  <Select
                    onValueChange={field.onChange}
                    value={String(field.value)}
                  >
                    <SelectTrigger className='w-full overflow-hidden'>
                      <SelectValue placeholder='Chọn địa chỉ mặc định' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {buyerAddresses.map((addr) => (
                          <SelectItem key={addr.id} value={addr.id}>
                            {addr.addressString}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className='text-muted-foreground text-sm'>
                    Không có địa chỉ. Hãy thêm địa chỉ!
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-center'>
            <Button
              type='submit'
              className='bg-mainColor2-800 tex-lg w-[70%] rounded-full text-white uppercase'
            >
              Cập nhật
            </Button>
          </div>
        </form>
      </Form>
      <AddAddress
        className='absolute -top-10 right-0'
        triggerParentRender={triggerRender}
      />
    </div>
  )
}
