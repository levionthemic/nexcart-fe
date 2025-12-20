'use client'
import { ArrowRightIcon, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getShopsApi } from '@/apis/shop.api'
import banner from '@/assets/banner.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shop } from '@/types/entities/shop'
import { getAddressString } from '@/utils/helpers'

import PageHeader from '../../_components/page-header'

import AddShopDialog from './_components/add-shop'
import OverviewStats from './_components/overview-stats'
import StoreCard from './_components/store-card'

export default function StoreList() {
  const [shops, setShops] = useState<Shop[]>([])

  useEffect(() => {
    getShopsApi().then(async (data) => {
      const shopsResult = []
      if (data)
        for (const d of data) {
          const shortAddress = await getAddressString({
            province_id: d.address.province_id,
            district_id: d.address.district_id,
            ward_code: d.address.ward_code,
            address: d.address.address
          })
          shopsResult.push({ ...d, shortAddress: shortAddress })
        }
      setShops(shopsResult)
    })
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
            link: '/seller/store',
            label: 'Cửa hàng'
          }
        ]}
        title='Danh sách cửa hàng'
      />

      <OverviewStats />

      {/* Toolbar */}
      <div className='bg-section mb-8 flex items-center justify-between gap-20 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <Button variant='outline'>Lọc</Button>
          <Button variant='outline'>Sắp xếp</Button>
        </div>

        <div className='relative w-full'>
          <Input
            className='peer ps-9 pe-9'
            placeholder='Tìm kiếm nhanh...'
            type='search'
          />
          <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
            <SearchIcon size={16} />
          </div>
          <button
            className='text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Submit search'
            type='submit'
          >
            <ArrowRightIcon size={16} aria-hidden='true' />
          </button>
        </div>

        <AddShopDialog trigger={<Button>+ Đăng kí cửa hàng mới</Button>} />
      </div>

      {/* List Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {shops.map((shop, index) => (
          <StoreCard
            {...shop}
            createdAt={shop.created_at}
            key={shop.id}
            logoUrl={banner}
            name={`Cửa hàng ${index + 1}`}
            productCount={48}
            onView={() => console.log('Xem chi tiết')}
            onEdit={() => console.log('Chỉnh sửa')}
          />
        ))}
      </div>
    </div>
  )
}
