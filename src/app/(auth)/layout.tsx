import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const sessionId = cookieStore.get('session_id')?.value

  if (accessToken && sessionId) redirect('/')

  return (
    <div className='flex items-center justify-center w-[100vw] h-[100vh]'>
      {children}
    </div>
  )
}
