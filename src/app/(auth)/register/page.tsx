import RegisterForm from '@/app/(auth)/register/register-form'
import WithGoogleOAuthProvider from '@/components/providers/WithGoogleOAuthProvider'

export default function RegisterPage() {
  return (
    <div
      className='w-[100vw] h-[100vh] bg-cover bg-no-repeat bg-center'
      style={{
        backgroundImage: 'url("/assets/background-auth.jpg")'
      }}
    >
      <div className='flex items-center justify-center w-full h-full bg-gray-900/60 animate-fadeIn'>
        <WithGoogleOAuthProvider>
          <RegisterForm />
        </WithGoogleOAuthProvider>
      </div>
    </div>
  )
}
