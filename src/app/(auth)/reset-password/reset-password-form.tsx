'use client'

import React from 'react'
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
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'

import { toast } from 'sonner'
import { resetPasswordAPI } from '@/apis/authApis'
import { asyncHandler } from '@/utils/asyncHandler'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ResetPasswordFormSchema,
  ResetPasswordFormSchemaType
} from '@/shared/schemas/auth.schema'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPasswordForm() {
  const form = useForm<ResetPasswordFormSchemaType>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChangePassword = async (data: { password: string }) => {
    const toastId = toast.loading('Đang cập nhật...')

    const [res] = await asyncHandler(
      resetPasswordAPI({
        password: data.password,
        resetToken: searchParams.get('resetToken')
      })
    )

    if (res) {
      toast.success(
        <div>
          <p className='font-bold'>Cập nhật mật khẩu thành công!</p>
          <p className='text-xs font-light'>
            Vui lòng đăng nhập lại để tiếp tục.
          </p>
        </div>
      )
      router.replace('/login')
    }

    toast.dismiss(toastId)
  }
  return (
    <div>
      {' '}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleChangePassword)}
          className='space-y-6'
        >
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base text-white'>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Vd: 12345678a'
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 text-white rounded-full focus:outline-none focus:border-[2px] border-[1px] ${
                      !!form.formState.errors['password'] && 'border-red-500'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base text-white'>
                  Xác nhận mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Vd: 12345678a'
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 text-white rounded-full focus:outline-none focus:border-[2px] border-[1px] ${
                      !!form.formState.errors['confirmPassword'] &&
                      'border-red-500'
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
    </div>
  )
}
