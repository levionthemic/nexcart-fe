'use client'

import OTP from '@/components/otp-fill-in'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
  FormControl
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { AccountStatus } from '@/types/enums/account'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE
} from '@/utils/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import React, { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

const RightFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
    .regex(EMAIL_RULE, { message: EMAIL_RULE_MESSAGE }),
  username: z.string()
})
type RightFormSchemaType = z.infer<typeof RightFormSchema>

export default function ProfileRightForm() {
  const currentUser = useSelector(selectCurrentUser)

  const rightForm = useForm<RightFormSchemaType>({
    resolver: zodResolver(RightFormSchema),
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email
    }
  })

  const [disableEmail, setDisableEmail] = useState<boolean>(true)
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(true)
  const handleChangeEmail = () => {
    //
  }

  const id = useId()

  const [checked, setChecked] = useState(
    currentUser?.status === AccountStatus.ACTIVE
  )

  const righFormHandleSubmit = (data: RightFormSchemaType) => {
    console.log(data)
  }

  return (
    <Form {...rightForm}>
      <form action='#' onSubmit={rightForm.handleSubmit(righFormHandleSubmit)}>
        <FormField
          control={rightForm.control}
          name='username'
          render={({ field }) => (
            <FormItem className='mt-2 mb-4'>
              <FormLabel className='text-base'>Tên tài khoản</FormLabel>
              <FormControl>
                <Input
                  className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-full focus:outline-none focus:border-[2px] border-[1px] ${
                    !!rightForm.formState.errors['username'] && 'border-red-500'
                  }`}
                  {...field}
                />
              </FormControl>
              <FormDescription>Tên tài khoản của bạn.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={rightForm.control}
          name='email'
          render={({ field }) => (
            <FormItem className='my-4'>
              <FormLabel className='text-base'>Email</FormLabel>
              <FormControl>
                <div className='flex items-center gap-4'>
                  <Input
                    disabled={disableEmail}
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-full focus:outline-none focus:border-[2px] border-[1px] ${
                      !!rightForm.formState.errors['email'] && 'border-red-500'
                    }`}
                    {...field}
                  />
                  <OTP
                    trigger={
                      <Button
                        variant='outline'
                        type='button'
                        onClick={handleChangeEmail}
                      >
                        <Pencil />
                        Thay đổi
                      </Button>
                    }
                    setOpen={setDisableEmail}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Mỗi tài khoản chỉ có duy nhất 1 email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={rightForm.control}
          name='password'
          render={({ field }) => (
            <FormItem className='my-4'>
              <FormLabel className='text-base'>Mật khẩu</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type='password'
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-full focus:outline-none focus:border-[2px] border-[1px] ${
                      !!rightForm.formState.errors['password'] &&
                      'border-red-500'
                    } ${showPasswordInput && 'hidden'}`}
                    {...field}
                  />
                  <OTP
                    trigger={
                      <Button
                        variant='outline'
                        type='button'
                        className={`${!showPasswordInput && 'hidden'}`}
                      >
                        <Pencil />
                        Thay đổi mật khẩu
                      </Button>
                    }
                    setState={setShowPasswordInput}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center gap-4 my-4'>
          <FormLabel className='text-base'>Trạng thái tài khoản</FormLabel>
          <div className='relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium'>
            <Switch
              id={id}
              checked={checked}
              onCheckedChange={setChecked}
              className='peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto rounded-lg [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-sm [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full'
            />
            <span className='min-w-78flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full'>
              <span className='text-[10px] font-medium uppercase'>
                Tạm khóa
              </span>
            </span>
            <span className='min-w-78flex peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full'>
              <span className='text-[10px] font-medium uppercase'>
                Bình thường
              </span>
            </span>
          </div>
        </div>

        <div className='flex justify-center mt-6'>
          <Button
            type='submit'
            className='w-[70%] rounded-full bg-mainColor2-800 text-white tex-lg uppercase'
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  )
}
