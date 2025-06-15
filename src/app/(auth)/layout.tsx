import { redirect, usePathname } from 'next/navigation'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname === '/login') redirect('/login')
  else if (pathname === '/register') redirect('/register')

  return (
    <div className='flex items-center justify-center w-[100vw] h-[100vh]'>
      {children}
    </div>
  )
}
