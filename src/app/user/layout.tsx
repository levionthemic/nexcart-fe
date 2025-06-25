import { SidebarProvider } from '@/components/ui/sidebar'
import UserSidebar from './_components/sidebar'
import ClientUserLayout from './client-layout'
import WithLoadingProvider from '@/components/providers/WithLoadingProvider'

export default function UserLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      className='font-nunitoSans'
      style={{ '--sidebar-width': '14rem' } as React.CSSProperties}
    >
      <UserSidebar />
      <main className='flex-1 overflow-x-auto'>
        {/* <SidebarTrigger /> */}
        <WithLoadingProvider>
          <ClientUserLayout>{children}</ClientUserLayout>
        </WithLoadingProvider>
      </main>
    </SidebarProvider>
  )
}
