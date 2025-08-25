'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { asyncHandler } from '@/utils/asyncHandler'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ForgotPasswordFormSchema,
  ForgotPasswordFormSchemaType
} from '@/shared/schemas/auth.schema'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { forgotPasswordApi } from '@/apis/auth.api'
import OtpFillIn from '@/components/otp-fill-in'

export default function ForgotPasswordForm() {
  const [open, setOpen] = useState<boolean>(false)

  const router = useRouter()

  const form = useForm<ForgotPasswordFormSchemaType>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: ''
    }
  })
  
  const handleForgotPassword = async (data: { email: string }) => {
    toast.promise(asyncHandler(forgotPasswordApi(data)), {
      loading: 'Đang xử lý...',
      success: () => {
        setOpen(true)
        return `Một mã OTP đã được gửi đến email ${data.email}!`
      },
      error: (err) => err.message
    })
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleForgotPassword)}
          className='space-y-6'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base text-white'>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nhập email tài khoản của bạn'
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 text-white rounded-full focus:outline-none focus:border-[2px] border-[1px] ${
                      !!form.formState.errors['email'] && 'border-red-500'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full py-5 rounded-full bg-mainColor2-800/85 animate-fadeInTop text-md'
          >
            Tiếp tục
          </Button>
        </form>
      </Form>
      <div className='mt-8 mb-2 text-xs text-white'>
        <div
          className='flex items-center gap-2 cursor-pointer hover:underline'
          onClick={() => router.push('/login')}
        >
          <ArrowLeft size={16} />
          Quay lại trang Đăng nhập
        </div>
      </div>
      <OtpFillIn open={open} setOpen={setOpen} email={form.getValues('email')} />
    </div>
  )
}
