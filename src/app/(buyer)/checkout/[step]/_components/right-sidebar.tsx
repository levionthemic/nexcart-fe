import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  CheckoutInfoType,
  ClusterOrderListItem
} from '@/contexts/order-context'

interface RightSidebarProps {
  clusterOrder: ClusterOrderListItem
  checkoutInfo: CheckoutInfoType | null
  index: number
}
export default function RightSidebar({
  clusterOrder,
  checkoutInfo,
  index
}: RightSidebarProps) {
  const totalPrice = clusterOrder.order_items?.reduce(
    (sum: number, item) => sum + item.quantity * item.product_variant.price,
    0
  )
  return (
    <div className='sticky top-36 left-0 mb-10 h-fit'>
      <div className='mb-4 rounded-md border border-b-[#ddd] p-4 shadow-md'>
        <div className='text-md text-mainColor1-800 font-medium'>
          Danh sách sản phẩm
        </div>
        {clusterOrder.order_items?.map(
          ({ product_variant, quantity }, index) => (
            <div
              key={index}
              className='my-6 flex items-center gap-2 overflow-hidden'
            >
              <Image
                src={product_variant.image_url}
                alt=''
                width={40}
                height={40}
                className='size-10 rounded-sm'
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
                    x {product_variant.price.toLocaleString('vi-VN')}
                    <sup>đ</sup>
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className='rounded-md border border-b-[#ddd] p-4 shadow-md'>
        <div className='text-md text-mainColor1-800 font-medium'>Chi tiết</div>

        <div className='px-2'>
          <div className='my-2 flex items-center justify-between text-sm'>
            <span className='opacity-40'>Tổng tiền hàng</span>
            <span className='font-bold text-red-600'>
              {totalPrice?.toLocaleString('vi-VN')}
              <sup>đ</sup>
            </span>
          </div>
          <div className='my-2 flex items-center justify-between text-sm'>
            <span className='opacity-40'>Phí vận chuyển</span>
            <span className='font-bold text-red-600'>
              {(
                checkoutInfo?.shipping?.[index]?.detail?.total || 0
              )?.toLocaleString()}
              <sup>đ</sup>
            </span>
          </div>
          <div className='my-2 flex items-center justify-between text-sm'>
            <span className='opacity-40'>Giảm giá sản phẩm</span>
            <span className='font-bold text-red-600'>
              - {(0)?.toLocaleString('vi-VN')}
              <sup>đ</sup>
            </span>
          </div>
          <div className='my-2 flex items-center justify-between text-sm'>
            <span className='opacity-40'>Giảm giá vận chuyển</span>
            <span className='font-bold text-red-600'>
              - {(0)?.toLocaleString('vi-VN')}
              <sup>đ</sup>
            </span>
          </div>
          <div className='my-2 flex items-center justify-between text-sm'>
            <span className='opacity-40'>Thuế</span>
            <span className='font-bold text-red-600'>
              {(0)?.toLocaleString('vi-VN')}
              <sup>đ</sup>
            </span>
          </div>
        </div>

        <div>
          <div className='text-mainColor1-800 font-bold'>
            Tổng tiền thanh toán
          </div>
          <div className='text-right text-xl font-bold text-red-600'>
            {(
              totalPrice +
              ((checkoutInfo?.shipping?.[index]?.detail?.total as number) || 0)
            ).toLocaleString('vi-VN')}
            <sup>đ</sup>
          </div>
        </div>
      </div>
    </div>
  )
}
