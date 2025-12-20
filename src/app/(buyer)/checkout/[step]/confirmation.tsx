'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { AddOrderPayload, createMomoPaymentApi } from '@/apis/order.api'
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

export default function Confirmation() {
  const { clusterOrders, checkoutInfo } = useOrder()

  const router = useRouter()

  const totalPrice = (clusterOrder: ClusterOrderListItem) => {
    return clusterOrder.order_items?.reduce(
      (sum, item) => sum + item.quantity * item.product_variant.price,
      0
    )
  }

  const handleCheckout = async () => {
    const toastId = toast.loading('Đang xử lý...')
    const data = clusterOrders.map((clusterOrder, index) => {
      const data: AddOrderPayload = {
        seller_id: clusterOrder.seller.seller_id,
        shop_id: clusterOrder.shop.id,
        buyer_address_id: Number(checkoutInfo?.information?.buyerAddress.id),
        discount_code: checkoutInfo?.discountCode?.[index] || '',
        note: checkoutInfo?.note?.[index] || '',
        original_price: clusterOrder.original_price,
        final_price:
          clusterOrder.original_price +
          Number(checkoutInfo?.shipping?.[index].detail.total || 0),
        shipping_fee: Number(checkoutInfo?.shipping?.[index].detail.total || 0),
        shipping_method:
          checkoutInfo?.shipping?.[index].type || ShippingMethod.GHN,
        order_items: clusterOrder.order_items.map((item) => ({
          product_variant_id: item.product_variant.id,
          quantity: item.quantity,
          price_at_purchase: item.product_variant.price
        }))
      }
      return data
    })
    try {
      const { payUrl } = await createMomoPaymentApi(data)
      router.push(payUrl)
    } catch {
      toast.error('da co loi')
    } finally {
      toast.dismiss(toastId)
    }
  }

  return (
    <>
      <div className='my-6 rounded-md border border-b-[#ddd] p-4'>
        <div className='text-mainColor1-600 mb-1 text-lg font-medium'>
          Xác nhận thông tin
        </div>
        <p className='text-muted-foreground text-[0.8rem]'>
          Kiểm tra kỹ trước khi đặt hàng!
        </p>
        <p className='text-muted-foreground mb-6 text-[0.8rem]'>
          Nếu thông tin đơn hàng đã trùng khớp, hãy bấm &quot;Đặt hàng&quot;!
        </p>
        <div className='mx-20 mb-2 flex items-center justify-between'>
          <span className='text-sm text-gray-400'>Tên người nhận hàng:</span>
          <span className='font-semibold'>
            {checkoutInfo?.information?.name}
          </span>
        </div>

        <div className='mx-20 mb-2 flex items-center justify-between'>
          <span className='text-sm text-gray-400'>Địa chỉ nhận hàng:</span>
          <span className='font-medium'>
            {checkoutInfo?.information?.buyerAddress.shortAddress}
          </span>
        </div>

        <div className='mx-20 mb-4 flex items-center justify-between'>
          <span className='text-sm text-gray-400'>Số điện thoại liên hệ:</span>
          <span className='font-medium'>
            {checkoutInfo?.information?.phone}
          </span>
        </div>
      </div>
      <div className='space-y-20'>
        {clusterOrders?.map((clusterOrder, index) => (
          <div key={index} className='mt-6'>
            <div className='text-mainColor1-800 text-xl font-semibold'>
              Đơn hàng {index + 1}
            </div>
            <div className='grid grid-cols-12 gap-10'>
              <div className='col-span-9'>
                <div className='mx-20 mt-4 mb-2 flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>
                    Dịch vụ vận chuyển:
                  </span>
                  <div className='text-mainColor1-600 flex items-center gap-4 font-semibold'>
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

                <div className='mx-20 mb-8 flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>
                    Phương thức thanh toán:
                  </span>
                  <span className='text-mainColor1-600 font-semibold'>
                    Thanh toán bằng tiền mặt
                  </span>
                </div>

                <div className='mb-4 rounded-md border border-b-[#ddd] p-4 shadow-md'>
                  <div className='text-md text-mainColor1-800 font-medium'>
                    Danh sách sản phẩm
                  </div>
                  {clusterOrder.order_items?.map(
                    ({ product_variant, quantity }, index) => (
                      <div
                        key={index}
                        className='my-4 flex items-center gap-4 overflow-hidden'
                      >
                        <Image
                          src={product_variant.image_url || DEFAULT_IMAGE_URL}
                          alt=''
                          width={80}
                          height={80}
                          className='size-20 rounded-md object-cover'
                        />
                        <div className='flex flex-1 items-center justify-between'>
                          <div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className='text-mainColor2-800 line-clamp-1 text-lg leading-none'>
                                    {product_variant.name}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{product_variant.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <p className='mb-0.5 line-clamp-1 text-sm text-gray-400'>
                              Loại: {product_variant.name}
                            </p>
                          </div>
                          <div className='flex flex-col lg:flex-row lg:items-center lg:gap-4'>
                            <Badge className='bg-mainColor2-800/90'>
                              {quantity} sản phẩm
                            </Badge>
                            <span className='text-muted-foreground'>
                              x {product_variant.price.toLocaleString('vi-VN')}
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
                <div className='rounded-md border border-b-[#ddd] p-4 shadow-md'>
                  <div className='text-md text-mainColor1-800 font-medium'>
                    Chi tiết
                  </div>

                  <div className='px-2'>
                    <div className='my-2 flex items-center justify-between text-sm'>
                      <span className='opacity-40'>Tổng tiền hàng</span>
                      <span className='font-bold text-red-600'>
                        {totalPrice(clusterOrder)?.toLocaleString('vi-VN')}
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
          className='text-mainColor1-600 border-mainColor1-600 text-md rounded-lg border bg-white font-semibold hover:bg-white hover:drop-shadow-xl'
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </div>

      <Button
        className='bg-mainColor1-600 hover:bg-mainColor1-800 mt-6 w-full rounded-xl py-6 text-xl text-white transition-all hover:duration-300 hover:ease-in-out'
        onClick={handleCheckout}
      >
        Đặt hàng
      </Button>
    </>
  )
}
