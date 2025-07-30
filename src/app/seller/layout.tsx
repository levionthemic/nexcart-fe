import { SidebarProvider } from '@/components/ui/sidebar'

import SellerHeader from '@/components/header/seller-header'
import SellerSidebar from './seller-sidebar'
import ClientSellerLayout from './client-layout'
import WithPersistProvider from '@/components/providers/WithPersistProvider'
import WithLoadingProvider from '@/components/providers/WithLoadingProvider'

export default function SellerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <WithPersistProvider>
      <WithLoadingProvider>
        <div className='font-quicksand'>
          <SidebarProvider>
            <SellerSidebar />
            <div className='flex-1 bg-slate-100 dark:bg-background w-[100vh-256px] overflow-x-hidden'>
              <SellerHeader />
              <ClientSellerLayout>{children}</ClientSellerLayout>
            </div>
          </SidebarProvider>
        </div>
      </WithLoadingProvider>
    </WithPersistProvider>
  )
}
