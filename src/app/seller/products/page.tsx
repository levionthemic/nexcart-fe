'use client'

import { Banknote, PackageOpen, RotateCcw, Truck } from 'lucide-react'
import CountUp from 'react-countup'
import ProductTable from './_components/product-table'
import PageHeader from '../_components/page-header'
import { useEffect, useState } from 'react'
import { ProductListItem } from '@/types/entities/product'
import { useLoading } from '@/contexts/loading-context'
import { getSellerProductsApi } from '@/apis/product.api'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/user/userSlice'

export default function Products() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const currentUser = useSelector(selectCurrentUser)
  const { startLoading, endLoading } = useLoading()

  useEffect(() => {
      startLoading()
      getSellerProductsApi(String(currentUser?.seller?.seller_id)).then((data) =>
        setProducts(data || [])
      ).finally(() => endLoading())
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

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='col-span-1 bg-card rounded-lg p-6 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Tổng Sản phẩm trong kho
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <CountUp
                end={products.length}
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
                end={1}
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
                end={products.filter(p => p.sold > 0).length}
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
                end={0}
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

      <ProductTable data={products} setData={setProducts}/>
    </div>
  )
}
