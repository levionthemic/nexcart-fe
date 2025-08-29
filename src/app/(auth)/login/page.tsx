import LoginForm from '@/app/(auth)/login/login-form'
import MyGoogleOAuthProvider from '@/components/providers/my-google-oauth-provider'

export default function LoginPage() {
  return (
    <div
      className='w-[100vw] h-[100vh] bg-cover bg-no-repeat bg-center'
      style={{
        backgroundImage: 'url("/assets/background-auth.jpg")'
      }}
    >
      <div className='flex items-center justify-center w-full h-full bg-white/10 dark:bg-gray-900/40'>
        <MyGoogleOAuthProvider>
          <LoginForm />
        </MyGoogleOAuthProvider>
      </div>
    </div>
  )
}
