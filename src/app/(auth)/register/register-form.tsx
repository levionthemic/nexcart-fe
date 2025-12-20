'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FaGoogle } from 'react-icons/fa'
import { toast } from 'sonner'

import { registerUserApi, registerWithGoogleApi } from '@/apis/auth.api'
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
  RegisterFormSchema,
  RegisterFormSchemaType
} from '@/shared/schemas/auth.schema'
import { Role, RoleValue } from '@/types/enums/role'
import { asyncHandler } from '@/utils/asyncHandler'

function RegisterForm() {
  const form = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: Role.BUYER
    }
  })

  const router = useRouter()

  const submitRegister = (data: {
    email: string
    password: string
    role: RoleValue
  }) => {
    const { email, password, role } = data
    toast.promise(asyncHandler(registerUserApi({ email, password, role })), {
      loading: 'Đang đăng ký...',
      success: (user) => {
        router.push(`/login?registeredEmail=${user.email}`)
        return 'Đăng ký thành công!'
      },
      error: (err) => err.message
    })
  }

  const submitRegisterWithGoogle = (
    data: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>
  ) => {
    toast.promise(registerWithGoogleApi(data), {
      loading: 'Đang đăng ký...',
      success: () => {
        router.push('/login')
        return 'Đăng ký thành công!'
      }
    })
  }

  const handleRegisterWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      submitRegisterWithGoogle(codeResponse)
    },
    onError: (error) => toast.error(error as string)
  })

  return (
    <div className='min-h-[600px] min-w-[500px] rounded-3xl border-[1px] border-solid border-gray-100 bg-gray-200/10 px-10 pb-4 backdrop-blur-sm'>
      <div className='mt-10 text-center text-4xl font-semibold text-white uppercase'>
        SIGN UP
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitRegister)}
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
                    placeholder='Vd: levionthemic@example.com'
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
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base text-white'>Vai trò</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className='flex justify-center gap-10 text-white'
                  >
                    <FormItem className='hover:bg-mainColor2-800/50 has-[button[data-state=checked]]:bg-mainColor2-800/40 has-[button[data-state=checked]]:border-accent border-muted/50 flex cursor-pointer items-center space-y-0 space-x-3 rounded-md border px-4 py-2 hover:transition-all hover:duration-400 hover:ease-in-out has-[button[data-state=checked]]:border-2'>
                      <FormControl>
                        <RadioGroupItem
                          value={Role.BUYER}
                          className='sr-only border-white bg-white'
                        />
                      </FormControl>
                      <FormLabel className='cursor-pointer text-sm font-normal'>
                        Người mua
                      </FormLabel>
                    </FormItem>
                    <FormItem className='hover:bg-mainColor2-800/50 has-[button[data-state=checked]]:bg-mainColor2-800/40 has-[button[data-state=checked]]:border-accent border-muted/50 flex cursor-pointer items-center space-y-0 space-x-3 rounded-md border px-4 py-2 hover:transition-all hover:duration-400 hover:ease-in-out has-[button[data-state=checked]]:border-2'>
                      <FormControl>
                        <RadioGroupItem
                          value={Role.SELLER}
                          className='sr-only border-white bg-white'
                        />
                      </FormControl>
                      <FormLabel className='cursor-pointer text-sm font-normal'>
                        Người bán
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className='bg-mainColor2-800/85 animate-fadeInTop text-md w-full rounded-full py-5'
          >
            Đăng ký
          </Button>
        </form>
      </Form>

      {form.getValues('role') === Role.BUYER && (
        <div className='mt-6 flex items-center justify-center gap-6 text-sm text-white'>
          <span>hoặc đăng ký bằng: </span>
          <div className='flex items-center justify-between gap-2'>
            <div
              onClick={() => handleRegisterWithGoogle()}
              className='hover:bg-mainColor1-600 cursor-pointer rounded-full border border-white p-1.5 transition-transform hover:scale-105 hover:border-[2px] hover:duration-300 hover:ease-in-out'
            >
              <FaGoogle />
            </div>
            <span className='text-muted text-xs'>(Chỉ cho Người mua)</span>
          </div>
        </div>
      )}
      <div className='mt-8 text-center text-xs text-white'>
        Đã có tài khoản?{' '}
        <div
          className='scale-100 cursor-pointer font-semibold underline hover:scale-110 hover:transition-transform hover:duration-200 hover:ease-in-out'
          onClick={() => router.push('/login')}
        >
          Đăng nhập
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
