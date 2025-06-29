import ResetPasswordForm from './reset-password-form'

export default function ResetPassword() {
  return (
    <div
      className='w-[100vw] h-[100vh] bg-cover bg-no-repeat bg-center'
      style={{
        backgroundImage: 'url("/assets/background-auth.jpg")'
      }}
    >
      <div className='flex items-center justify-center w-full h-full bg-gray-900/60 aimate-fadeIn'>
        <div className='w-[500px] min-h-[500px] bg-gray-200/10 rounded-3xl border-gray-100 border-solid border-[1px] px-10 pb-4 animate-fadeInTop backdrop-blur-sm'>
          <div className='my-10 text-3xl font-semibold text-center text-white'>
            Đổi mật khẩu
          </div>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
