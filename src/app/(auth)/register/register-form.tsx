'use client'

import { useForm } from 'react-hook-form'
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

import { toast } from 'sonner'
import { registerUserAPI } from '@/apis/authApis'
import { FaGoogle } from 'react-icons/fa'
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'
import { Role, RoleValue } from '@/types/enums/role'
import {
  RegisterFormSchema,
  RegisterFormSchemaType
} from '@/shared/schemas/auth.schema'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

function RegisterForm() {
  const form = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: Role.Buyer
    }
  })

  const router = useRouter()

  const submitRegister = (data: {
    email: string
    password: string
    role: RoleValue
  }) => {
    const { email, password, role } = data
    toast.promise(registerUserAPI({ email, password, role }), {
      loading: 'Đang đăng ký...',
      success: (user) => {
        if (!user.error) {
          router.push(`/login?registeredEmail=${user.email}`)
          return 'Đăng ký thành công!'
        }
        throw user
      }
    })
  }
  const submitRegisterWithGoogle = (
    data: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>
  ) => {
    toast.promise(registerUserAPI(data), {
      loading: 'Đang đăng ký...',
      success: (res) => {
        if (!res.error) {
          router.push('/login')
          return 'Đăng ký thành công!'
        }
        throw res
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
    <div className='min-w-[500px] min-h-[600px] bg-gray-200/10 rounded-3xl border-gray-100 border-solid border-[1px] px-10 pb-4 animate-fadeInTop backdrop-blur-sm'>
      <div className='mt-10 text-4xl font-semibold text-center text-white uppercase'>
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
                    className='flex justify-center gap-2 text-white'
                  >
                    <FormItem className='flex items-center space-x-3 space-y-0 hover:bg-mainColor2-800/50 px-4 py-3 rounded-md hover:transition-all hover:ease-in-out hover:duration-400 cursor-pointer has-[button[data-state=checked]]:bg-mainColor2-800/50'>
                      <FormControl>
                        <RadioGroupItem
                          value={Role.Buyer}
                          className='bg-white border-white'
                        />
                      </FormControl>
                      <FormLabel className='font-normal cursor-pointer'>
                        Người mua
                      </FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0 hover:bg-mainColor2-800/50 px-4 py-3 rounded-md hover:transition-all hover:ease-in-out hover:duration-400 cursor-pointer has-[button[data-state=checked]]:bg-mainColor2-800/50'>
                      <FormControl>
                        <RadioGroupItem
                          value={Role.Seller}
                          className='bg-white border-white'
                        />
                      </FormControl>
                      <FormLabel className='font-normal cursor-pointer'>
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
            className='w-full py-5 rounded-full bg-mainColor2-800/85 animate-fadeInTop text-md'
          >
            Đăng ký
          </Button>
        </form>
      </Form>

      {form.getValues('role') === Role.Buyer && (
        <div className='flex items-center justify-center gap-6 mt-6 text-sm text-white'>
          <span>hoặc đăng ký bằng: </span>
          <div className='flex items-center justify-between gap-2'>
            <div
              onClick={() => handleRegisterWithGoogle()}
              className='border border-white rounded-full p-1.5 cursor-pointer hover:bg-mainColor1-600 hover:border-[2px] hover:scale-105 hover:duration-300 hover:ease-in-out transition-transform'
            >
              <FaGoogle />
            </div>
            <span className='text-xs text-muted'>(Chỉ cho Người mua)</span>
          </div>
        </div>
      )}
      <div className='mt-8 text-xs text-center text-white'>
        Đã có tài khoản?{' '}
        <div
          className='font-semibold underline scale-100 cursor-pointer hover:scale-110 hover:transition-transform hover:ease-in-out hover:duration-200'
          onClick={() => router.push('/login')}
        >
          Đăng nhập
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
