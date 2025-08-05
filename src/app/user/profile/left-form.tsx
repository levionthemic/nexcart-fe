'use client'

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
  updateUserAPI
} from '@/redux/user/userSlice'
import { Gender } from '@/types/enums/account'
import { getAddressString } from '@/utils/helpers'
import {
  FIELD_REQUIRED_MESSAGE,
  PHONE_NUMBER_RULE,
  PHONE_NUMBER_RULE_MESSAGE
} from '@/utils/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { z } from 'zod'
import AddAddress from '../_components/add-address'

const LeftFormSchema = z.object({
   phone: z
    .string()
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
    .regex(PHONE_NUMBER_RULE, { message: PHONE_NUMBER_RULE_MESSAGE }),

  name: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }),
  gender: z.nativeEnum(Gender),
  defaultBuyerAddressId: z
    .string()
    .uuid()
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
})

type LeftFormSchemaType = z.infer<typeof LeftFormSchema>

export default function ProfileLeftForm() {
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
  }, [])

  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectCurrentUser)

  const leftForm = useForm<LeftFormSchemaType>({
    resolver: zodResolver(LeftFormSchema),
    defaultValues: {
      phone: currentUser?.phone || '',
      name: currentUser?.name || '',
      gender: currentUser?.gender || Gender.MALE,
      defaultBuyerAddressId: currentUser?.buyer?.addresses.find(
        (a) => a.isDefault
      )?.id
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
  }, [renderCount])

  const handleLeftFormSubmit = (data: LeftFormSchemaType) => {
    toast.promise(dispatch(updateUserAPI(data)).unwrap(), {
      loading: 'Đang cập nhật...',
      success: () => 'Cập nhật thành công!',
      error: () => 'Đã có lỗi!'
    })
  }

  return (
    <div className='relative'>
      <Form {...leftForm}>
        <form
          action='#'
          onSubmit={leftForm.handleSubmit(handleLeftFormSubmit)}
          className='w-full'
        >
          <FormField
            control={leftForm.control}
            name='name'
            render={({ field }) => (
              <FormItem className='mt-2 mb-4'>
                <FormLabel className='text-base'>Họ và tên</FormLabel>
                <FormControl>
                  <Input
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-full focus:outline-none focus:border-[2px] border-[1px] ${
                      !!leftForm.formState.errors['name'] && 'border-red-500'
                    }`}
                    placeholder='Vd: Nguyễn Văn A'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Mặc định chúng tôi sẽ lấy họ và tên này in trên đơn hàng.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-4 my-4'>
            <FormField
              control={leftForm.control}
              name='gender'
              render={({ field }) => (
                <FormItem className='my-3'>
                  <FormLabel className='text-base'>Giới tính</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex items-center gap-10 md:flex-col md:gap-4 md:items-start'
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value={Gender.MALE} />
                        </FormControl>
                        <FormLabel className='font-normal'>Nam</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value={Gender.FEMALE} />
                        </FormControl>
                        <FormLabel className='font-normal'>Nữ</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={leftForm.control}
              name='phone'
              render={({ field }) => (
                <FormItem className='my-2'>
                  <FormLabel className='text-base'>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='VD: 0123456789'
                      className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-5 rounded-full focus:outline-none focus:border-[2px] border-[1px] ${
                        !!leftForm.formState.errors['phone'] && 'border-red-500'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Số điện thoại này được dùng để liên lạc với người vận
                    chuyển.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={leftForm.control}
            name='defaultBuyerAddressId'
            render={({ field }) => (
              <FormItem className='mb-6'>
                <FormLabel>Địa chỉ mặc định</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full overflow-hidden'>
                    <SelectValue placeholder='Chọn địa chỉ mặc định' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {buyerAddresses.length ? (
                        buyerAddresses.map((addr) => (
                          <SelectItem key={addr.id} value={addr.id}>
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

          <div className='flex justify-center'>
            <Button
              type='submit'
              className='w-[70%] rounded-full bg-mainColor2-800 text-white tex-lg uppercase'
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
