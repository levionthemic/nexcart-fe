'use client'

import {
  Coins,
  Layers,
  MoreHorizontal,
  Package2,
  Percent,
  TrendingDown,
  TrendingUp
} from 'lucide-react'
import CountUp from 'react-countup'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

import BestSoldProducts from './_components/best-sold-products'
import LatestOrders from './_components/latest-orders'
import MultiLineChartComponent from './_components/multiline-chart'
import PieChartComponent from './_components/pie-chart'
import Timer from './_components/timer'

export default function Dashboard() {
  return (
    <div className='px-6 py-4'>
      <div className='mb-4 flex items-end justify-between'>
        <div className=''>
          <div className='text-xl font-bold'>Dashboard</div>
          <p className='text-sm text-gray-500'>
            Tổng quan về cửa hàng của bạn trong tuần này
          </p>
        </div>
        <Timer />
      </div>

      <div className='mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4'>
        <div className='bg-card col-span-1 rounded-lg p-6'>
          <div className='mb-3 flex items-center gap-3 text-gray-500'>
            <Coins />
            <span className='text-sm font-semibold'>Tổng Doanh thu</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='gap-1/2 flex flex-col text-3xl font-bold'>
              <CountUp end={2158000} start={1.5} separator='.' />
              <span className='text-xs text-gray-600'>VNĐ</span>
            </span>
            <div className='flex flex-col items-end'>
              <div className='flex items-center gap-2 text-sm text-green-600'>
                <TrendingUp />
                <span>
                  +<CountUp end={6.0} start={1.5} decimals={2} />%
                </span>
              </div>
              <span className='text-xs text-gray-400'>so với tuần trước</span>
            </div>
          </div>

          <div></div>
        </div>

        <div className='bg-card col-span-1 rounded-lg p-6'>
          <div className='mb-3 flex items-center gap-3 text-gray-500'>
            <Package2 />
            <span className='text-sm font-semibold'>Tổng Sản phẩm</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='gap-1/2 flex flex-col text-3xl font-bold'>
              <CountUp end={488} start={1.5} />
              <span className='text-xs text-gray-600'>sản phẩm</span>
            </span>
            <div className='flex flex-col items-end'>
              <div className='flex items-center gap-2 text-sm text-red-600'>
                <TrendingDown />
                <span>
                  -<CountUp end={6.0} start={1.5} decimals={2} />%
                </span>
              </div>
              <span className='text-xs text-gray-400'>so với tuần trước</span>
            </div>
          </div>

          <div></div>
        </div>

        <div className='bg-card col-span-1 rounded-lg p-6'>
          <div className='mb-3 flex items-center gap-3 text-gray-500'>
            <Layers />
            <span className='text-sm font-semibold'>Tổng Đơn hàng</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='gap-1/2 flex flex-col text-3xl font-bold'>
              <CountUp end={123} start={1.5} />
              <span className='text-xs text-gray-600'>đơn hàng</span>
            </span>
            <div className='flex flex-col items-end'>
              <div className='flex items-center gap-2 text-sm text-red-600'>
                <TrendingDown />
                <span>
                  -<CountUp end={6.0} start={1.5} decimals={2} />%
                </span>
              </div>
              <span className='text-xs text-gray-400'>so với tuần trước</span>
            </div>
          </div>

          <div></div>
        </div>

        <div className='bg-card col-span-1 rounded-lg p-6'>
          <div className='mb-3 flex items-center gap-3 text-gray-500'>
            <Percent />
            <span className='text-sm font-semibold'>Tỉ lệ chuyển đổi</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='gap-1/2 flex flex-col text-3xl font-bold'>
              <CountUp end={5.03} start={1.5} decimals={2} />
              <span className='text-xs text-gray-600'>%</span>
            </span>
            <div className='flex flex-col items-end'>
              <div className='flex items-center gap-2 text-sm text-red-600'>
                <TrendingDown />
                <span>
                  -<CountUp end={5.03} start={1.5} decimals={2} />%
                </span>
              </div>
              <span className='text-xs text-gray-400'>so với tuần trước</span>
            </div>
          </div>

          <div></div>
        </div>
      </div>

      <div className='mb-4 grid grid-cols-10 gap-4'>
        <div className='bg-section drop-shadow-mainColor1-100 col-span-7 rounded-lg p-6 drop-shadow-md'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='text-lg font-semibold'>Tổng quan</div>
            <MoreHorizontal className='cursor-pointer text-gray-400' />
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <MultiLineChartComponent />
            <PieChartComponent />
          </div>
        </div>

        <div className='bg-section drop-shadow-mainColor1-100 col-span-3 rounded-lg p-6 drop-shadow-md'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='text-lg font-semibold'>Sản phẩm bán chạy nhất</div>
            <MoreHorizontal className='cursor-pointer text-gray-400' />
          </div>

          <BestSoldProducts />
        </div>
      </div>

      <div className='grid grid-cols-10 gap-4'>
        <div className='bg-section drop-shadow-mainColor1-100 col-span-7 rounded-lg p-6 drop-shadow-md'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='text-lg font-semibold'>Đơn hàng mới nhất</div>
            <Button variant='outline' className=''>
              Tất cả
            </Button>
          </div>

          <LatestOrders />
        </div>

        <div className='bg-section drop-shadow-mainColor1-100 col-span-3 rounded-lg p-6 drop-shadow-md'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='text-lg font-semibold'>Khách hàng thân thiết</div>
            <MoreHorizontal className='cursor-pointer text-gray-400' />
          </div>

          <ul>
            <li className='flex items-center gap-4'>
              <div className='flex flex-1 items-center gap-3'>
                <Avatar>
                  <AvatarImage src={DEFAULT_IMAGE_URL} />
                  <AvatarFallback>LV</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='line-clamp-1'>Tên khách hàng</span>
                  <span className='text-muted-foreground text-sm'>
                    15 đơn hàng
                  </span>
                </div>
              </div>
              <div className='rounded-lg border px-2 py-1.5 text-sm font-semibold'>
                Xem chi tiết
              </div>
            </li>
            <li className='mt-4 flex items-center gap-4'>
              <div className='flex flex-1 items-center gap-3'>
                <Avatar>
                  <AvatarImage src={DEFAULT_IMAGE_URL} />
                  <AvatarFallback>LV</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='line-clamp-1'>Tên khách hàng</span>
                  <span className='text-muted-foreground text-sm'>
                    15 đơn hàng
                  </span>
                </div>
              </div>
              <div className='rounded-lg border px-2 py-1.5 text-sm font-semibold'>
                Xem chi tiết
              </div>
            </li>
            <li className='mt-4 flex items-center gap-4'>
              <div className='flex flex-1 items-center gap-3'>
                <Avatar>
                  <AvatarImage src={DEFAULT_IMAGE_URL} />
                  <AvatarFallback>LV</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='line-clamp-1'>Tên khách hàng</span>
                  <span className='text-muted-foreground text-sm'>
                    15 đơn hàng
                  </span>
                </div>
              </div>
              <div className='rounded-lg border px-2 py-1.5 text-sm font-semibold'>
                Xem chi tiết
              </div>
            </li>
            <li className='mt-4 flex items-center gap-4'>
              <div className='flex flex-1 items-center gap-3'>
                <Avatar>
                  <AvatarImage src={DEFAULT_IMAGE_URL} />
                  <AvatarFallback>LV</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='line-clamp-1'>Tên khách hàng</span>
                  <span className='text-muted-foreground text-sm'>
                    15 đơn hàng
                  </span>
                </div>
              </div>
              <div className='rounded-lg border px-2 py-1.5 text-sm font-semibold'>
                Xem chi tiết
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
