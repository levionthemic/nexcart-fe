import { SellerHeader } from '@/components/layout/header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { LoadingProvider } from '@/contexts/loading-context'

import ClientSellerLayout from './client-layout'
import SellerSidebar from './seller-sidebar'

export default function SellerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='font-quicksand'>
      <LoadingProvider>
        <SidebarProvider>
          <SellerSidebar />
          <div className='dark:bg-background w-[100vh-256px] flex-1 overflow-x-hidden bg-slate-100'>
            <SellerHeader />
            <ClientSellerLayout>{children}</ClientSellerLayout>
          </div>
        </SidebarProvider>
      </LoadingProvider>
    </div>
  )
}
