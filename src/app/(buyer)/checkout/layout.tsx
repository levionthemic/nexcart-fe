import { OrderProvider } from '@/contexts/order-context'
import TimelineComponent from './[step]/_components/timeline-component'

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const timelineItems = [
    {
      id: 1,
      title: 'Thông tin',
      description: 'Điền thông tin đơn hàng'
    },
    {
      id: 2,
      title: 'Vận chuyển',
      description: 'Chọn hình thức vận chuyển'
    },
    {
      id: 3,
      title: 'Thanh toán',
      description: 'Chọn phương thức thanh toán'
    },
    {
      id: 4,
      title: 'Xác nhận',
      description: 'Xác nhận đơn hàng'
    }
  ]

  return (
    <div className='container mx-auto py-6'>
      <div className='font-semibold text-3xl text-mainColor1-600 mb-8'>
        Thanh toán
      </div>

      <div className=''>
        <TimelineComponent items={timelineItems} />

        <OrderProvider>{children}</OrderProvider>
      </div>
    </div>
  )
}
