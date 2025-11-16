/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Banknote, CircleX, NotepadText, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

import { useLoading } from '@/contexts/loading-context'
import PageHeader from '../_components/page-header'
import OrderTable from './order-table'
import { getOrdersApi } from '@/apis/order.api'
import { Order } from '@/types/entities/order'

export default function Orders() {
  const { startLoading, endLoading } = useLoading()

  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    startLoading()
    getOrdersApi()
      .then((data) => {
        if (data) setOrders(data)
      })
      .finally(() => endLoading())
  }, [])

  return (
    <div className='px-6 py-4'>
      <PageHeader
        links={[
          {
            link: '/seller',
            label: 'Dashboard'
          },
          {
            link: '/seller/ordes',
            label: 'Đơn hàng'
          }
        ]}
        title='Quản lý đơn hàng'
      />

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        <div className='col-span-1 bg-section rounded-lg p-6 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Tổng Đơn hàng đã nhận
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <CountUp
                end={173}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>đơn hàng</span>
            </span>
          </div>
          <div className='bg-[#F0FAFF] text-blue-500 p-2 rounded-full'>
            <NotepadText />
          </div>
        </div>
        <div className='col-span-1 bg-section rounded-lg p-6 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Đơn hàng đang vận chuyển
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <CountUp
                end={14}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>đơn hàng</span>
            </span>
          </div>
          <div className='bg-[#FFFAEF] text-yellow-500 p-2 rounded-full'>
            <Truck />
          </div>
        </div>
        <div className='col-span-1 bg-section rounded-lg p-6 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Đơn hàng thành công
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <CountUp
                end={150}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>đơn hàng</span>
            </span>
          </div>
          <div className='bg-[#F1FCF6] text-green-600 p-2 rounded-full'>
            <Banknote />
          </div>
        </div>
        <div className='col-span-1 bg-section rounded-lg p-6 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Đơn hàng đã hủy
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <CountUp
                end={9}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>đơn hàng</span>
            </span>
          </div>
          <div className='bg-[#E8E8E8] text-gray-500 p-2 rounded-full'>
            <CircleX />
          </div>
        </div>
      </div>

      <OrderTable data={orders} setData={setOrders} />
    </div>
  )
}
