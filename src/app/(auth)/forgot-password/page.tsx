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
import OTP from '@/components/OTP'
import { useState } from 'react'
import { toast } from 'sonner'
import { forgotPasswordAPI } from '@/apis/authApis'
import { asyncHandler } from '@/utils/asyncHandler'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ForgotPasswordFormSchema,
  ForgotPasswordFormSchemaType
} from '@/shared/schemas/auth.schema'
import { useRouter } from 'next/navigation'

function ForgotPassword() {
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm<ForgotPasswordFormSchemaType>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: ''
    }
  })

  const router = useRouter()

  const handleForgotPassword = async (data: { email: string }) => {
    const toastId = toast.loading('Đang xử lý...')

    const [res] = await asyncHandler(forgotPasswordAPI(data))

    toast.dismiss(toastId)

    if (res) {
      setOpen(true)
    }
  }

  return (
    <div className='w-[100vw] h-[100vh] bg-[url("@/assets/background-auth.jpg")] bg-cover bg-no-repeat bg-center'>
      <div className='flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-60 animate-fadeIn'>
        <div className='w-[500px] min-h-[500px] bg-gray-200 bg-opacity-10 rounded-3xl border-gray-100 border-solid border-[1px] px-10 pb-4 animate-fadeInTop backdrop-blur-sm'>
          <div className='mt-10 text-3xl font-semibold text-center text-white'>
            Lấy lại mật khẩu
          </div>

          <div className='mt-8 mb-10 text-sm text-white'>
            Bạn quên mật khẩu? Đừng quá lo lắng, chỉ cần điền email và chúng tôi
            có thể giúp bạn khôi phục lại mật khẩu!
          </div>

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
                    <FormLabel className='text-base text-white'>
                      Email
                    </FormLabel>
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
        </div>
      </div>

      <OTP open={open} setOpen={setOpen} email={form.getValues('email')} />
    </div>
  )
}

export default ForgotPassword
