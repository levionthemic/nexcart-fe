'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { resetPasswordApi } from '@/apis/auth.api'
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
  ResetPasswordFormSchema,
  ResetPasswordFormSchemaType
} from '@/shared/schemas/auth.schema'
import { asyncHandler } from '@/utils/asyncHandler'

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
    toast.promise(
      asyncHandler(
        resetPasswordApi({
          password: data.password,
          reset_token: searchParams.get('reset_token')
        })
      ),
      {
        loading: 'Đang cập nhật...',
        success: () => {
          router.replace('/login')
          return 'Cập nhật mật khẩu thành công!'
        },
        error: (err) => err.message
      }
    )
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
                    className={`placeholder:text-opacity-50 rounded-full border-[1px] text-white placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
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
                    className={`placeholder:text-opacity-50 rounded-full border-[1px] text-white placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
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
    </div>
  )
}
