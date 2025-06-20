export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex items-center justify-center w-[100vw] h-[100vh]'>
      {children}
    </div>
  )
}
