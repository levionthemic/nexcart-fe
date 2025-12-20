/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { FaCheck } from 'react-icons/fa'
import { useDispatch } from 'react-redux'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useOrder } from '@/contexts/order-context'
import { fetchCurrentCartAPI } from '@/redux/cart/cartSlice'
import { AppDispatch } from '@/redux/store'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

export default function Completion() {
  const dispatch = useDispatch<AppDispatch>()
  const { checkoutData } = useOrder()

  useEffect(() => {
    dispatch(fetchCurrentCartAPI())
  }, [])

  return (
    <div className='container mx-auto'>
      <div className='relative flex max-h-full py-4'>
        <div className='col-span-2 flex w-[75%] flex-col items-center justify-center py-4'>
          <div className='mb-10 rounded-full bg-green-400 p-5 text-3xl text-white'>
            <FaCheck />
          </div>
          <div className='mb-2 text-2xl font-semibold'>
            Đã đặt hàng thành công!
          </div>
          <p>
            Bạn có thể theo dõi đơn hàng đã đặt trong mục{' '}
            <Link href={'/user/orders'} className='italic'>
              Đơn hàng của tôi
            </Link>
          </p>
          <div className='flex items-center justify-center gap-6'>
            <Button className='mt-10 hover:shadow-xl'>
              <Link href='/'>Tiếp tục mua sắm</Link>
            </Button>
            <Button className='border-mainColor1-100 text-mainColor1-800 hover:bg-mainColor1-800 mt-10 border bg-white hover:text-white hover:shadow-xl'>
              <Link href='/user/orders'>Xem đơn hàng</Link>
            </Button>
          </div>
        </div>

        <div className='flex-1'>
          {checkoutData?.map((data, index) => (
            <div key={index}>
              <div className='text-mainColor1-800 mb-2 text-xl font-semibold'>
                Đơn hàng {index + 1}
              </div>
              <div className='mb-4 rounded-md border border-b-[#ddd] p-4 shadow-md'>
                <div className='text-md text-mainColor1-800 font-medium'>
                  Danh sách sản phẩm
                </div>
                {data?.order_items?.map(
                  ({ product_variant, quantity }, index) => (
                    <div
                      key={index}
                      className='my-6 flex items-center gap-2 overflow-hidden'
                    >
                      <Image
                        src={product_variant?.image_url || DEFAULT_IMAGE_URL}
                        alt=''
                        width={40}
                        height={40}
                        className='size-10'
                      />
                      <div className='flex flex-col gap-1'>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className='text-mainColor2-800 line-clamp-1 text-sm leading-none'>
                                {product_variant?.name}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{product_variant?.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <p className='mb-0.5 line-clamp-1 text-xs text-gray-400'>
                          Loại: {product_variant.name}
                        </p>
                        <div className='flex flex-col lg:flex-row lg:items-center lg:gap-4'>
                          <Badge className='bg-mainColor2-800/90'>
                            {quantity} sản phẩm
                          </Badge>
                          <span className='text-muted-foreground text-[0.8rem]'>
                            x {product_variant?.price.toLocaleString('vi-VN')}
                            <sup>đ</sup>
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className='rounded-md border border-b-[#ddd] p-4 shadow-md'>
                <div className='text-md text-mainColor1-800 font-medium'>
                  Tóm tắt đơn hàng
                </div>

                <div className='px-2'>
                  <div className='my-2 flex items-center justify-between text-sm'>
                    <span className='opacity-40'>Tổng tiền hàng</span>
                    <span className='font-bold text-red-600'>
                      {data?.final_price?.toLocaleString('vi-VN')}
                      <sup>đ</sup>
                    </span>
                  </div>
                  <div className='my-2 flex items-center justify-between text-sm'>
                    <span className='opacity-40'>Phí vận chuyển</span>
                    <span className='font-bold text-red-600'>
                      {data?.shipping_fee?.toLocaleString('vi-VN')}
                      <sup>đ</sup>
                    </span>
                  </div>
                </div>

                <div>
                  <div className='text-mainColor1-800 font-medium'>
                    Tổng tiền thanh toán
                  </div>
                  <div className='text-right text-xl font-bold text-red-600'>
                    {(data?.final_price + data?.shipping_fee)?.toLocaleString(
                      'vi-VN'
                    )}
                    <sup>đ</sup>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
