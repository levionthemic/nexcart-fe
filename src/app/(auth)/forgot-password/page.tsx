import ForgotPasswordForm from './forgot-password-form'

function ForgotPassword() {
  return (
    <div
      className='w-[100vw] h-[100vh] bg-cover bg-no-repeat bg-center'
      style={{
        backgroundImage: 'url("/assets/background-auth.jpg")'
      }}
    >
      <div className='flex items-center justify-center w-full h-full bg-gray-600/20'>
        <div className='w-[500px] min-h-[500px] bg-gray-200/10 rounded-3xl border-gray-100 border-solid border-[1px] px-10 pb-4 backdrop-blur-sm'>
          <div className='mt-10 text-3xl font-semibold text-center text-white'>
            Lấy lại mật khẩu
          </div>

          <div className='mt-8 mb-10 text-sm text-white'>
            Bạn quên mật khẩu? Đừng quá lo lắng, chỉ cần điền email và chúng tôi
            có thể giúp bạn khôi phục lại mật khẩu!
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
