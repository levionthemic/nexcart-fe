import LoginForm from '@/app/(auth)/login/login-form'
import WithGoogleOAuthProvider from '@/components/providers/WithGoogleOAuthProvider'

export default function LoginPage() {
  return (
    <div
      className='w-[100vw] h-[100vh] bg-cover bg-no-repeat bg-center'
      style={{
        backgroundImage: 'url("/assets/background-auth.jpg")'
      }}
    >
      <div className='flex items-center justify-center w-full h-full bg-gray-900/50 animate-fadeIn'>
        <WithGoogleOAuthProvider>
          <LoginForm />
        </WithGoogleOAuthProvider>
      </div>
    </div>
  )
}
