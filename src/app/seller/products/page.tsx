'use client'

import { Banknote, PackageOpen, RotateCcw, Truck } from 'lucide-react'
import CountUp from 'react-countup'
import ProductTable from './_components/product-table'
import PageHeader from '../_components/page-header'

export default function Products() {
  return (
    <div className='px-6 py-4'>
      <PageHeader
        links={[
          {
            link: '/seller',
            label: 'Dashboard'
          },
          {
            link: '/seller/products',
            label: 'Sản phẩm'
          }
        ]}
        title={'Quản lý sản phẩm'}
      />

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='col-span-1 bg-card rounded-lg p-6 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Tổng Sản phẩm trong kho
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <CountUp
                end={1461}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>sản phẩm</span>
            </span>
          </div>
          <div className='bg-[#F0FAFF] text-blue-500 p-2 rounded-full'>
            <PackageOpen />
          </div>
        </div>
        <div className='col-span-1 bg-card rounded-lg p-6 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Sản phẩm trong đơn hàng
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <CountUp
                end={214}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>sản phẩm</span>
            </span>
          </div>
          <div className='bg-[#FFFAEF] text-yellow-500 p-2 rounded-full'>
            <Truck />
          </div>
        </div>
        <div className='col-span-1 bg-card rounded-lg p-6 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Sản phẩm đã bán
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <CountUp
                end={148}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>sản phẩm</span>
            </span>
          </div>
          <div className='bg-[#F1FCF6] text-green-600 p-2 rounded-full'>
            <Banknote />
          </div>
        </div>
        <div className='col-span-1 bg-card rounded-lg p-6 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Sản phẩm hoàn trả
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <CountUp
                end={50}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>sản phẩm</span>
            </span>
          </div>
          <div className='bg-[#E8E8E8] text-gray-500 p-2 rounded-full'>
            <RotateCcw />
          </div>
        </div>
      </div>

      <ProductTable />
    </div>
  )
}
