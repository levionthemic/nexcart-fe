import RegisterForm from '@/app/(auth)/register/register-form'

export default function RegisterPage() {
  return (
    <div className='w-[100vw] h-[100vh] bg-[url("@/assets/background-auth.jpg")] bg-cover bg-no-repeat bg-center'>
      <div className='flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-60 animate-fadeIn'>
        <RegisterForm />
      </div>
    </div>
  )
}
