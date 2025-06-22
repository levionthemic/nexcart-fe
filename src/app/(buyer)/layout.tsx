import ClientBuyerLayout from './client-layout'
import Footer from '@/components/footer/footer'
import BuyerHeader from '@/components/header/buyer-header/buyer-header'

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='font-nunitoSans relative max-h-full'>
      <BuyerHeader />
      <ClientBuyerLayout>{children}</ClientBuyerLayout>
      <Footer />
    </div>
  )
}
