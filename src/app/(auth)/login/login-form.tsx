'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'
import Cookies from 'js-cookie'
import { Check, Info } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaFacebookF, FaGoogle } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { AppDispatch } from '@/redux/store'
import { loginUserAction, setUser } from '@/redux/user/userSlice'
import {
  LoginFormSchema,
  LoginFormSchemaType
} from '@/shared/schemas/auth.schema'
import { Role } from '@/types/enums/role'

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      role: Role.BUYER
    }
  })

  const router = useRouter()

  const [rememberMeCheck, setRememberMeCheck] = useState(false)

  const searchParams = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const submitLogIn = async (
    data:
      | LoginFormSchemaType
      | Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>
  ) => {
    toast.promise(
      dispatch(
        loginUserAction({ ...data, remember_me: rememberMeCheck })
      ).unwrap(),
      {
        loading: 'Đang đăng nhập...',
        success: async (res) => {
          Cookies.set('access_token', res.access_token, {
            expires: res.remember_me ? 14 : undefined
          })
          Cookies.set('session_id', res.session_id, {
            expires: res.remember_me ? 14 : undefined
          })

          const userData = await fetch('/api/me', {
            credentials: 'include'
          }).then((res) => res.json())

          dispatch(setUser(userData))

          if (userData.role === Role.BUYER) location.href = '/'
          else location.href = '/seller'
          return 'Đăng nhập thành công!'
        },
        error: (err) => err.message
      }
    )
  }

  const handleLoginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse: TokenResponse) => {
      submitLogIn(codeResponse)
    },
    onError: (error) => toast.error(error as string)
  })

  return (
    <div className='animate-fadeInTop min-h-[500px] w-[500px] rounded-3xl border-[1px] border-solid border-gray-100 bg-gray-200/10 px-10 pb-4 backdrop-blur-sm'>
      <div className='mt-10 text-center text-4xl font-semibold text-white uppercase'>
        Đăng nhập
      </div>

      <div className='py-4'>
        {verifiedEmail && (
          <Alert className='bg-[#EDF7ED]/80'>
            <Check className='h-4 w-4' />
            <AlertTitle className='font-semibold'>
              Xác nhận thành công!
            </AlertTitle>
            <AlertDescription>
              Email của bạn:&nbsp;
              <b>
                <i>{verifiedEmail}</i>
              </b>
              &nbsp;đã được xác thực. Ngay bây giờ bạn có thể đăng nhập để có
              thể trải nghiệm dịch vụ của chúng tôi! <br />
              Chúc bạn một ngày tốt lành!
            </AlertDescription>
          </Alert>
        )}
        {registeredEmail && (
          <Alert className='bg-[#E5F6FD]/80'>
            <Info className='h-4 w-4 items-center' />
            <AlertTitle>Thông báo!</AlertTitle>
            <AlertDescription>
              Chúng tôi đã gửi 1 email đến email:&nbsp;
              <br />
              <b>{registeredEmail}</b> <br />
              Hãy kiểm tra và xác thực trước khi đăng nhập!
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitLogIn)} className='space-y-6'>
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
                <div className='flex items-center justify-between'>
                  <div className='mt-1/2 flex items-center gap-1.5 text-white'>
                    <Checkbox
                      id='remember-me'
                      className='border-white'
                      checked={rememberMeCheck}
                      onCheckedChange={(checked) =>
                        setRememberMeCheck(!!checked)
                      }
                    />
                    <label
                      htmlFor='remember-me'
                      className='cursor-pointer text-sm leading-none hover:underline'
                    >
                      Lưu mật khẩu trong 14 ngày
                    </label>
                  </div>

                  <Link
                    href='/forgot-password'
                    className='cursor-pointer text-right text-xs text-white hover:underline'
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
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
                    className='flex items-center justify-center gap-10 text-white'
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
            Đăng nhập
          </Button>
        </form>
      </Form>

      <div className='my-10 flex items-center justify-between text-xs text-gray-200'>
        <div className='h-px w-[32%] border-b border-gray-300'></div>
        <span>hoặc đăng nhập bằng: </span>
        <div className='h-px w-[32%] border-b border-gray-300'></div>
      </div>
      <div className='mt-6 flex items-center justify-between gap-6 text-sm text-white'>
        <div
          onClick={() => handleLoginWithGoogle()}
          className='hover:bg-mainColor1-600 flex w-full cursor-pointer items-center justify-center rounded-sm border border-white p-2 transition-transform hover:scale-105 hover:border-[2px] hover:duration-300 hover:ease-in-out'
        >
          <FaGoogle size={20} />
        </div>
        <div className='hover:bg-mainColor1-600 flex w-full cursor-pointer items-center justify-center rounded-sm border border-white p-2 transition-transform hover:scale-105 hover:border-[2px] hover:duration-300 hover:ease-in-out'>
          <FaFacebookF size={20} />
        </div>
      </div>

      <div className='mt-8 text-center text-xs text-white'>
        Chưa có tài khoản?{' '}
        <div
          className='scale-100 cursor-pointer font-semibold underline hover:scale-110 hover:transition-transform hover:duration-200 hover:ease-in-out'
          onClick={() => router.push('/register')}
        >
          Đăng kí
        </div>
      </div>
    </div>
  )
}
