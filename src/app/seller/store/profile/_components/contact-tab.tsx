'use client'

import { useForm } from 'react-hook-form'
import { BsTiktok } from 'react-icons/bs'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
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
import { selectCurrentUser, updateUserAction } from '@/redux/user/userSlice'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PHONE_NUMBER_RULE,
  PHONE_NUMBER_RULE_MESSAGE
} from '@/utils/validators'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppDispatch } from '@/redux/store'
import { AccountStatus } from '@/types/enums/account'

const formSchema = z.object({
  phone: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .regex(PHONE_NUMBER_RULE, { message: PHONE_NUMBER_RULE_MESSAGE }),
  email: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .regex(EMAIL_RULE, { message: EMAIL_RULE_MESSAGE }),
  address: z.string({ required_error: FIELD_REQUIRED_MESSAGE }),
  socialNetworks: z.array(z.string()).min(3)
})
export type ContactTabFormSchemaType = z.infer<typeof formSchema>

export default function ContactTab() {
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectCurrentUser)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      address: currentUser?.seller?.address || '',
      socialNetworks: currentUser?.seller.socialNetworks || ['', '', '']
    }
  })

  const handleUpdateStoreGeneralInformation = (data: ContactTabFormSchemaType) => {
    delete data['email']
    toast.promise(
      dispatch(
        updateUserAction({
          ...data,
          status: AccountStatus.ACTIVE,
          role: currentUser?.role
        })
      ),
      {
        loading: 'Đang cập nhật...',
        success: (res) => {
          if (!res.error) return 'Cập nhật thành công!'
          throw res
        }
      }
    )
  }

  return (
    <div className='bg-section p-4 rounded-lg'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateStoreGeneralInformation)}>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-4 mb-4'>
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-3'>
                      <div className='col-span-1'>
                        <FormLabel className='text-base whitespace-nowrap'>
                          Số điện thoại
                        </FormLabel>
                        <FormDescription className=''>
                          Chỉ dùng 1 số.
                        </FormDescription>
                      </div>
                      <div className='col-span-2'>
                        <FormControl className='mb-2'>
                          <Input
                            placeholder='Vd: 0123456789'
                            className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] ${
                              !!form.formState.errors['phone'] &&
                              'border-red-500'
                            }`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-3'>
                      <div className='col-span-1'>
                        <FormLabel className='text-base'>Email</FormLabel>
                        <FormDescription className=''>
                          Chỉ dùng 1 email.
                        </FormDescription>
                      </div>

                      <div className='col-span-2'>
                        <FormControl className='mb-2'>
                          <Input
                            disabled
                            placeholder='Vd: abc@example.com'
                            className='placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-3'>
                      <div className=''>
                        <FormLabel className='text-base'>
                          Địa chỉ liên hệ
                        </FormLabel>
                        <FormDescription className=''>
                          Dùng địa chỉ bạn tiếp nhận bưu kiện.
                        </FormDescription>
                      </div>
                      <div className='col-span-2'>
                        <FormControl className='mb-2'>
                          <Input
                            className='placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className=''>
              <div className='flex items-end gap-4 mb-3.5'>
                <FormLabel className='text-base'>
                  Liên kết mạng xã hội
                </FormLabel>
                <FormDescription>
                  Điền các liên kết mạng xã hội (nếu có).
                </FormDescription>
              </div>
              <FormField
                control={form.control}
                name='socialNetworks.0'
                render={({ field }) => (
                  <FormItem className='mb-1'>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='Facebook'
                          className='peer ps-9 placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px]'
                          {...field}
                        />
                        <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                          <FaFacebookF size={16} />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='socialNetworks.1'
                render={({ field }) => (
                  <FormItem className='mb-1'>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='Instagram'
                          className='peer ps-9 placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px]'
                          {...field}
                        />
                        <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                          <FaInstagram size={16} />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='socialNetworks.2'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='Tiktok'
                          className='peer ps-9 placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px]'
                          {...field}
                        />
                        <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                          <BsTiktok size={16} />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type='submit'
            className='bg-mainColor1-800/85 rounded-lg w-full py-3 text-md mt-8'
          >
            Cập nhật chỉnh sửa
          </Button>
        </form>
      </Form>
    </div>
  )
}
