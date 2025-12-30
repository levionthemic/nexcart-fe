/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Banknote, CircleX, NotepadText, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

import { getOrdersApi } from '@/apis/order.api'
import { useLoading } from '@/contexts/loading-context'
import { Order } from '@/types/entities/order'

import PageHeader from '../_components/page-header'

import OrderTable from './order-table'

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

      <div className='mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4'>
        <div className='bg-section col-span-1 flex items-center justify-between rounded-lg p-6'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Tổng Đơn hàng đã nhận
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <CountUp
                end={173}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>đơn hàng</span>
            </span>
          </div>
          <div className='rounded-full bg-[#F0FAFF] p-2 text-blue-500'>
            <NotepadText />
          </div>
        </div>
        <div className='bg-section col-span-1 flex items-center justify-between rounded-lg p-6'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Đơn hàng đang vận chuyển
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <CountUp
                end={14}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>đơn hàng</span>
            </span>
          </div>
          <div className='rounded-full bg-[#FFFAEF] p-2 text-yellow-500'>
            <Truck />
          </div>
        </div>
        <div className='bg-section col-span-1 flex items-center justify-between rounded-lg p-6'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Đơn hàng thành công
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <CountUp
                end={150}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>đơn hàng</span>
            </span>
          </div>
          <div className='rounded-full bg-[#F1FCF6] p-2 text-green-600'>
            <Banknote />
          </div>
        </div>
        <div className='bg-section col-span-1 flex items-center justify-between rounded-lg p-6'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Đơn hàng đã hủy
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <CountUp
                end={9}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>đơn hàng</span>
            </span>
          </div>
          <div className='rounded-full bg-[#E8E8E8] p-2 text-gray-500'>
            <CircleX />
          </div>
        </div>
      </div>

      <OrderTable data={orders} setData={setOrders} />
    </div>
  )
}
