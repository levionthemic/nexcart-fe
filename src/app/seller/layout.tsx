import { SidebarProvider } from '@/components/ui/sidebar'

import SellerHeader from '@/components/header/seller-header'
import SellerSidebar from './seller-sidebar'
import ClientSellerLayout from './client-layout'

export default function SellerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='font-quicksand'>
      <SidebarProvider>
        <SellerSidebar />
        <div className='flex-1 bg-slate-100 dark:bg-background w-[100vh-256px] overflow-x-hidden'>
          <SellerHeader />
          <ClientSellerLayout>{children}</ClientSellerLayout>
        </div>
      </SidebarProvider>
    </div>
  )
}
