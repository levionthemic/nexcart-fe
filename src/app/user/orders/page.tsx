import {
  CheckCheck,
  Loader,
  Package,
  TrendingDown,
  TrendingUp,
  Truck
} from 'lucide-react'

import UserHeader from '../_components/header'

import OrderTable from './order-table'

function UserOrder() {
  return (
    <div className='px-4'>
      <div className='bg-background relative flex h-[100vh] items-center overflow-auto rounded-lg'>
        <div className='h-full w-full px-2'>
          {/* Header */}
          <UserHeader />

          {/* Content */}
          <div className='mb-6'>
            <div className='text-mainColor1-800 text-3xl font-semibold uppercase'>
              Đơn hàng
            </div>
            <p className='text-sm text-gray-500'>
              Hãy xem những hoạt động mua hàng của bạn trong tuần vừa qua!
            </p>
          </div>

          <div className='my-6 grid grid-cols-4 gap-5'>
            <div className='bg-section w-full rounded-lg border py-2'>
              <div className='text-md text-mainColor1-600 flex items-center justify-between rounded-lg px-4 py-1.5 font-medium'>
                <span>Tổng số đơn hàng</span>
                <div className='rounded-full bg-[#F7F7FE] p-2'>
                  <Package />
                </div>
              </div>
              <div className='flex items-end gap-10'>
                <span className='my-1 ml-4 text-2xl leading-none font-bold'>
                  2380
                </span>
                <div className='flex items-center gap-2 text-sm text-green-500'>
                  <TrendingUp className='w-4 leading-none' />
                  <span>6.53%</span>
                </div>
              </div>
            </div>

            <div className='bg-section w-full rounded-lg border py-2'>
              <div className='text-md text-mainColor2-800/90 flex items-center justify-between rounded-lg px-4 py-1.5 font-medium'>
                <span>Đơn đang xử lý</span>
                <div className='rounded-full bg-[#F9F6FE] p-2'>
                  <Loader />
                </div>
              </div>
              <div className='flex items-end gap-10'>
                <span className='my-1 ml-4 text-2xl leading-none font-bold'>
                  32
                </span>
                <div className='flex items-center gap-2 text-sm text-red-500'>
                  <TrendingDown className='w-4 leading-none' />
                  <span>6.53%</span>
                </div>
              </div>
            </div>

            <div className='bg-section w-full rounded-lg border py-2'>
              <div className='text-md flex items-center justify-between rounded-lg px-4 py-1.5 font-medium text-red-500'>
                <span>Đơn đang vận chuyển</span>
                <div className='rounded-full bg-[#FEF6F5] p-2'>
                  <Truck />
                </div>
              </div>
              <div className='flex items-end gap-10'>
                <span className='my-1 ml-4 text-2xl leading-none font-bold'>
                  127
                </span>
                <div className='flex items-center gap-2 text-sm text-green-500'>
                  <TrendingUp className='w-4 leading-none' />
                  <span>6.53%</span>
                </div>
              </div>
            </div>

            <div className='bg-section w-full rounded-lg border py-2'>
              <div className='text-md flex items-center justify-between rounded-lg px-4 py-1.5 font-medium text-green-500'>
                <span>Đơn đã giao</span>
                <div className='rounded-full bg-[#F3FEF8] p-2'>
                  <CheckCheck />
                </div>
              </div>
              <div className='flex items-end gap-10'>
                <span className='my-1 ml-4 text-2xl leading-none font-bold'>
                  29
                </span>
                <div className='flex items-center gap-2 text-sm text-red-500'>
                  <TrendingDown className='w-4 leading-none' />
                  <span>6.53%</span>
                </div>
              </div>
            </div>
          </div>

          <OrderTable />
        </div>
      </div>
    </div>
  )
}

export default UserOrder
