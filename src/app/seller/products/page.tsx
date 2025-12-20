/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Banknote, PackageOpen, RotateCcw, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { useSelector } from 'react-redux'

import { getSellerProductsApi } from '@/apis/product.api'
import { useLoading } from '@/contexts/loading-context'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { ProductListItem } from '@/types/entities/product'

import PageHeader from '../_components/page-header'

import ProductTable from './_components/product-table'

export default function Products() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const currentUser = useSelector(selectCurrentUser)
  const { startLoading, endLoading } = useLoading()

  useEffect(() => {
    startLoading()
    getSellerProductsApi(String(currentUser?.seller?.seller_id))
      .then((data) => setProducts(data.data || []))
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
            link: '/seller/products',
            label: 'Sản phẩm'
          }
        ]}
        title={'Quản lý sản phẩm'}
      />

      <div className='mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4'>
        <div className='bg-card col-span-1 flex items-center justify-between rounded-lg p-6'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Tổng Sản phẩm trong kho
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <CountUp
                end={products.length}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>sản phẩm</span>
            </span>
          </div>
          <div className='rounded-full bg-[#F0FAFF] p-2 text-blue-500'>
            <PackageOpen />
          </div>
        </div>
        <div className='bg-card col-span-1 flex items-center justify-between rounded-lg p-6'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Sản phẩm trong đơn hàng
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <CountUp
                end={1}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>sản phẩm</span>
            </span>
          </div>
          <div className='rounded-full bg-[#FFFAEF] p-2 text-yellow-500'>
            <Truck />
          </div>
        </div>
        <div className='bg-card col-span-1 flex items-center justify-between rounded-lg p-6'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Sản phẩm đã bán
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <CountUp
                end={products.filter((p) => p.sold > 0).length}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>sản phẩm</span>
            </span>
          </div>
          <div className='rounded-full bg-[#F1FCF6] p-2 text-green-600'>
            <Banknote />
          </div>
        </div>
        <div className='bg-card col-span-1 flex items-center justify-between rounded-lg p-6'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Sản phẩm hoàn trả
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <CountUp
                end={0}
                duration={1.5}
                separator='.'
                className='leading-none'
              />
              <span className='text-xs text-gray-600'>sản phẩm</span>
            </span>
          </div>
          <div className='rounded-full bg-[#E8E8E8] p-2 text-gray-500'>
            <RotateCcw />
          </div>
        </div>
      </div>

      <ProductTable data={products} setData={setProducts} />
    </div>
  )
}
