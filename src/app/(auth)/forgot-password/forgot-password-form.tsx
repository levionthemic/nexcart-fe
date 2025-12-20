'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { forgotPasswordApi } from '@/apis/auth.api'
import OtpFillIn from '@/components/otp-fill-in'
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
import {
  ForgotPasswordFormSchema,
  ForgotPasswordFormSchemaType
} from '@/shared/schemas/auth.schema'
import { asyncHandler } from '@/utils/asyncHandler'

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
                    className={`placeholder:text-opacity-50 rounded-full border-[1px] text-white placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
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
            className='bg-mainColor2-800/85 animate-fadeInTop text-md w-full rounded-full py-5'
          >
            Tiếp tục
          </Button>
        </form>
      </Form>
      <div className='mt-8 mb-2 text-xs text-white'>
        <div
          className='flex cursor-pointer items-center gap-2 hover:underline'
          onClick={() => router.push('/login')}
        >
          <ArrowLeft size={16} />
          Quay lại trang Đăng nhập
        </div>
      </div>
      <OtpFillIn
        open={open}
        setOpen={setOpen}
        email={form.getValues('email')}
      />
    </div>
  )
}
