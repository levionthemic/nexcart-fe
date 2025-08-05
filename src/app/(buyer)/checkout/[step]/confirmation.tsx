'use client'

import { addOrderApi, AddOrderPayload } from '@/apis/order.api'
import ghnLogo from '@/assets/ghn-logo.png'
import ghtkLogo from '@/assets/ghtk-logo.png'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ClusterOrderListItem, useOrder } from '@/contexts/order-context'
import { ShippingMethod } from '@/types/enums/checkout'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Confirmation() {
  const { clusterOrders, checkoutInfo, setCheckoutData } = useOrder()

  const router = useRouter()

  const totalPrice = (clusterOrder: ClusterOrderListItem) => {
    return clusterOrder.orderItems?.reduce(
      (sum, item) => sum + item.quantity * item.product.type.price,
      0
    )
  }

  const handleCheckout = () => {
    toast.promise(
      Promise.all(
        clusterOrders.map((clusterOrder, index) => {
          const data: AddOrderPayload = {
            sellerId: clusterOrder.seller.id,
            shopId: clusterOrder.shop.id,
            buyerAddressId: String(checkoutInfo?.information?.buyerAddress.id),
            discountCode: checkoutInfo?.discountCode?.[index] || '',
            note: checkoutInfo?.note?.[index] || '',
            originalPrice: clusterOrder.originalPrice,
            finalPrice:
              clusterOrder.originalPrice +
              Number(checkoutInfo?.shipping?.[index].detail.total),
            shippingFee: Number(checkoutInfo?.shipping?.[index].detail.total),
            shippingMethod:
              checkoutInfo?.shipping?.[index].type || ShippingMethod.GHN,
            orderItems: clusterOrder.orderItems.map((orderItem) => ({
              productId: orderItem.product.id,
              typeId: orderItem.product.type.id,
              quantity: orderItem.quantity,
              unitPrice: orderItem.product.type.price,
              discount: orderItem.product.type.discount,
              finalPrice:
                (orderItem.product.type.price *
                  (100 - orderItem.product.type.discount)) /
                100
            }))
          }
          return addOrderApi(data)
        })
      ),
      {
        loading: 'Đang xử lý...',
        success: (res) => {
          router.push('/checkout/complete')
          setCheckoutData(res)
          return 'Thành công!'
        },
        error: 'Đã có lỗi!'
      }
    )
  }

  return (
    <>
      <div className='my-6 border border-b-[#ddd] rounded-md p-4'>
        <div className='text-mainColor1-600 font-medium text-lg mb-1'>
          Xác nhận thông tin
        </div>
        <p className='text-[0.8rem] text-muted-foreground'>
          Kiểm tra kỹ trước khi đặt hàng!
        </p>
        <p className='mb-6 text-[0.8rem] text-muted-foreground'>
          Nếu thông tin đơn hàng đã trùng khớp, hãy bấm &quot;Đặt hàng&quot;!
        </p>
        <div className='flex items-center justify-between mx-20 mb-2'>
          <span className='text-sm text-gray-400'>Tên người nhận hàng:</span>
          <span className='font-semibold'>
            {checkoutInfo?.information?.name}
          </span>
        </div>

        <div className='flex items-center justify-between mx-20 mb-2'>
          <span className='text-sm text-gray-400'>Địa chỉ nhận hàng:</span>
          <span className='font-medium'>
            {checkoutInfo?.information?.buyerAddress.shortAddress}
          </span>
        </div>

        <div className='flex items-center justify-between mx-20 mb-4'>
          <span className='text-sm text-gray-400'>Số điện thoại liên hệ:</span>
          <span className='font-medium'>
            {checkoutInfo?.information?.phone}
          </span>
        </div>
      </div>
      <div className='space-y-20'>
        {clusterOrders?.map((clusterOrder, index) => (
          <div key={index} className='mt-6'>
            <div className='font-semibold text-xl text-mainColor1-800'>
              Đơn hàng {index + 1}
            </div>
            <div className='grid grid-cols-12 gap-10'>
              <div className='col-span-9'>
                <div className='flex items-center justify-between mx-20 mb-2 mt-4'>
                  <span className='text-sm text-gray-400'>
                    Dịch vụ vận chuyển:
                  </span>
                  <div className='font-semibold text-mainColor1-600 flex items-center gap-4'>
                    <Image
                      src={
                        checkoutInfo?.shipping?.[index].type ===
                        ShippingMethod.GHN
                          ? ghnLogo
                          : ghtkLogo
                      }
                      alt=''
                      width={20}
                      height={20}
                    />
                    {checkoutInfo?.shipping?.[index].type ===
                      ShippingMethod.GHN && 'Giao hàng nhanh'}
                    {checkoutInfo?.shipping?.[index].type ===
                      ShippingMethod.GHTK && 'Giao hàng tiết kiệm'}
                  </div>
                </div>

                <div className='flex items-center justify-between mx-20 mb-8'>
                  <span className='text-sm text-gray-400'>
                    Phương thức thanh toán:
                  </span>
                  <span className='font-semibold text-mainColor1-600'>
                    Thanh toán bằng tiền mặt
                  </span>
                </div>

                <div className='border border-b-[#ddd] rounded-md mb-4 p-4 shadow-md'>
                  <div className='text-md text-mainColor1-800 font-medium'>
                    Danh sách sản phẩm
                  </div>
                  {clusterOrder.orderItems?.map(
                    ({ product, quantity }, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-4 my-4 overflow-hidden'
                      >
                        <Image
                          src={product.avatar || DEFAULT_IMAGE_URL}
                          alt=''
                          width={80}
                          height={80}
                          className='rounded-md size-20 object-cover'
                        />
                        <div className='flex items-center justify-between flex-1'>
                          <div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className='text-lg line-clamp-1 text-mainColor2-800 leading-none'>
                                    {product.name}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{product.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <p className='line-clamp-1 text-sm text-gray-400 mb-0.5'>
                              Loại: {product.type.name}
                            </p>
                          </div>
                          <div className='flex flex-col lg:flex-row lg:items-center lg:gap-4'>
                            <Badge className='bg-mainColor2-800/90'>
                              {quantity} sản phẩm
                            </Badge>
                            <span className='text-muted-foreground'>
                              x {product.type.price.toLocaleString('vi-VN')}
                              <sup>đ</sup>
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className='col-span-3'>
                <div className='border border-b-[#ddd] rounded-md p-4 shadow-md'>
                  <div className='text-md text-mainColor1-800 font-medium'>
                    Chi tiết
                  </div>

                  <div className='px-2'>
                    <div className='flex items-center justify-between text-sm my-2'>
                      <span className='opacity-40'>Tổng tiền hàng</span>
                      <span className='font-bold text-red-600'>
                        {totalPrice(clusterOrder)?.toLocaleString('vi-VN')}
                        <sup>đ</sup>
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-sm my-2'>
                      <span className='opacity-40'>Phí vận chuyển</span>
                      <span className='font-bold text-red-600'>
                        {(
                          checkoutInfo?.shipping?.[index]?.detail?.total || 0
                        )?.toLocaleString()}
                        <sup>đ</sup>
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-sm my-2'>
                      <span className='opacity-40'>Giảm giá sản phẩm</span>
                      <span className='font-bold text-red-600'>
                        - {0?.toLocaleString('vi-VN')}
                        <sup>đ</sup>
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-sm my-2'>
                      <span className='opacity-40'>Giảm giá vận chuyển</span>
                      <span className='font-bold text-red-600'>
                        - {0?.toLocaleString('vi-VN')}
                        <sup>đ</sup>
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-sm my-2'>
                      <span className='opacity-40'>Thuế</span>
                      <span className='font-bold text-red-600'>
                        {0?.toLocaleString('vi-VN')}
                        <sup>đ</sup>
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className='font-bold text-mainColor1-800'>
                      Tổng tiền thanh toán
                    </div>
                    <div className='text-red-600 text-right text-xl font-bold'>
                      {(
                        totalPrice(clusterOrder) +
                        ((checkoutInfo?.shipping?.[index]?.detail
                          ?.total as number) || 0)
                      ).toLocaleString('vi-VN')}
                      <sup>đ</sup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 gap-5'>
        <Button
          type='submit'
          className='border bg-white text-mainColor1-600  border-mainColor1-600 hover:bg-white text-md font-semibold rounded-lg hover:drop-shadow-xl'
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </div>

      <Button
        className='mt-6 w-full bg-mainColor1-600 hover:bg-mainColor1-800 transition-all hover:ease-in-out hover:duration-300 text-white text-xl py-6 rounded-xl'
        onClick={handleCheckout}
      >
        Đặt hàng
      </Button>
    </>
  )
}
