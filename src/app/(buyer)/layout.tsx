import ClientBuyerLayout from './client-layout'
import Footer from '@/components/footer/footer'
import BuyerHeader from '@/components/header/buyer-header/buyer-header'
import WithLoadingProvider from '@/components/providers/WithLoadingProvider'
import WithPersistProvider from '@/components/providers/WithPersistProvider'

export default async function BuyerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <WithLoadingProvider>
      <div className='font-nunitoSans relative min-h-screen'>
        <WithPersistProvider>
          <BuyerHeader />
        </WithPersistProvider>

        <ClientBuyerLayout>{children}</ClientBuyerLayout>
        <Footer />
      </div>
    </WithLoadingProvider>
  )
}
