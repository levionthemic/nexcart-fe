import Footer from '@/components/layout/footer/footer'
import { BuyerHeader } from '@/components/layout/header'
import { LoadingProvider } from '@/contexts/loading-context'
import { OrderProvider } from '@/contexts/order-context'

import ClientBuyerLayout from './client-layout'

export default async function BuyerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <LoadingProvider>
      <OrderProvider>
        <div className='font-nunitoSans relative min-h-screen'>
          <BuyerHeader />

          <ClientBuyerLayout>{children}</ClientBuyerLayout>
          <Footer />
        </div>
      </OrderProvider>
    </LoadingProvider>
  )
}
