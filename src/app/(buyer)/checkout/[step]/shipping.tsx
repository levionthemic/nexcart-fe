'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/validators'
import { useEffect, useId, useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import ghtkLogo from '@/assets/ghtk-logo.png'
import ghnLogo from '@/assets/ghn-logo.png'
import { cloneDeep } from 'lodash'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { getAddressString } from '@/utils/helpers'
import { z } from 'zod'
import { ShippingMethod } from '@/types/enums/checkout'
import Image from 'next/image'
import { Address } from '@/types/entities/address'
import RightSidebar from './_components/right-sidebar'
import { ShippingDataType, useOrder } from '@/contexts/order-context'
import { useRouter } from 'next/navigation'
import { clusterOrdersApi } from '@/apis/order.api'
import { getAvailableServicesApi, getFeeApi } from '@/apis/ghn.api'

const formSchema = z.object({
  discountCode: z.array(z.string()),
  shippingMethod: z
    .array(z.nativeEnum(ShippingMethod))
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  note: z.array(z.string())
})
export type ShippingFormSchemaType = z.infer<typeof formSchema>

export default function Shipping() {
  const id = useId()
  const router = useRouter()

  const {
    clusterOrders,
    setClusterOrders,
    checkoutInfo,
    setCheckoutInfo,
    orderItems
  } = useOrder()

  const form = useForm<ShippingFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discountCode: [...Array(clusterOrders.length)].map(() => ''),
      note: [...Array(clusterOrders.length)].map(() => ''),
      shippingMethod: checkoutInfo?.shipping?.map((s) => s.type)
    }
  })

  useEffect(() => {
    const body = orderItems.map((orderItem) => ({
      product_variant_id: orderItem.product_variant.id,
      quantity: orderItem.quantity
    }))
    clusterOrdersApi({ order_items: body }).then((data) => {
      if (data) {
        form.reset({
          discountCode: [...Array(data.length)].map(() => ''),
          note: [...Array(data.length)].map(() => ''),
          shippingMethod: checkoutInfo?.shipping?.map((s) => s.type)
        })
        setClusterOrders(data)
      }
    })
  }, [])

  const [shopAddresses, setShopAddresses] = useState<string[]>([])
  useEffect(() => {
    const getAddressStringResult = async (addr: Address) => {
      const result = await getAddressString(addr)
      return result
    }

    Promise.all(
      clusterOrders.map((clusterOrder) =>
        getAddressStringResult(clusterOrder.shop.address)
      )
    ).then((res) => setShopAddresses(res))
  }, [clusterOrders])

  const [shippingData, setShippingData] = useState<ShippingDataType[][]>([])
  const [ghnServiceError, setGhnServiceError] = useState<string>('')
  useEffect(() => {
    const shippingDataResult: ShippingDataType[][] = []
    if (clusterOrders.length) {
      for (const clusterOrder of clusterOrders) {
        getAvailableServicesApi({
          fromDistrictId: Number(
            checkoutInfo?.information?.buyerAddress.district_id
          ),
          toDistrictId: Number(clusterOrder.shop.address.district_id)
        }).then((res) => {
          if (!res) {
            setGhnServiceError(
              'GHN hiện không hỗ trợ giao hàng từ địa chỉ đã chọn.'
            )
            const result = [
              {
                type: ShippingMethod.GHTK,
                detail: {}
              },
              {
                type: ShippingMethod.GHN,
                detail: {}
              }
            ]
            shippingDataResult.push(result)
            return
          } else {
            getFeeApi({
              service_id: 0,
              service_type_id: 2,
              from_district_id: clusterOrder?.shop?.address.district_id,
              from_ward_code: clusterOrder?.shop.address.ward_code,
              to_district_id:
                checkoutInfo?.information?.buyerAddress.district_id,
              to_ward_code: checkoutInfo?.information?.buyerAddress.ward_code,
              weight: 3000,
              insurance_value: 0,
              coupon: null,
              items: clusterOrder.order_items.map((item) => ({
                name: item.product_variant.name,
                quantity: item.quantity
              }))
            }).then((data) => {
              if (data) {
                const result = [
                  {
                    type: ShippingMethod.GHTK,
                    detail: {}
                  },
                  {
                    type: ShippingMethod.GHN,
                    detail: data
                  }
                ]
                shippingDataResult.push(result)
              }
            })
          }
        })
      }
      setShippingData(shippingDataResult)
    }
  }, [clusterOrders.length])

  const handleUpdateShipping = (data: ShippingFormSchemaType) => {
    setCheckoutInfo({
      ...checkoutInfo,
      discountCode: data.discountCode,
      note: data.note
    })
    router.push('/checkout/3')
  }

  const handleChooseShippingMethod = (value: string, index: number) => {
    const prevShipping = checkoutInfo?.shipping || []
    const shipping = shippingData[index].find((s) => s.type === value)!
    prevShipping[index] = shipping

    setCheckoutInfo({
      ...checkoutInfo,
      shipping: prevShipping
    })
  }

  const handleBack = () => {
    const oldCheckoutInfo = cloneDeep(checkoutInfo)!
    if (oldCheckoutInfo?.shipping) delete oldCheckoutInfo.shipping
    setCheckoutInfo(oldCheckoutInfo)
    router.back()
  }

  return (
    <div className=''>
      <div className='text-red-400 font-semibold mt-4 mb-10'>
        Lưu ý: Đơn hàng của bạn có thể được TÁCH thành nhiều đơn hàng nhỏ theo
        chính sách của chúng tôi!
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateShipping)}
          className='space-y-20'
        >
          {clusterOrders.map((clusterOrder, index) => (
            <div key={index} className='grid grid-cols-12 gap-12'>
              <div className='border-[2px] rounded-md p-4 col-span-9'>
                <div className='font-semibold text-xl text-mainColor1-800'>
                  Đơn hàng {index + 1}
                </div>
                <Separator className='mt-1 mb-4' />
                <div className='space-y-8'>
                  <div className='grid grid-cols-2 gap-10 items-start'>
                    <FormItem>
                      <FormLabel className='text-mainColor1-600 font-medium text-lg'>
                        Địa chỉ nhận hàng
                      </FormLabel>
                      <FormDescription className='!mt-0'>
                        Địa chỉ bạn đã điền ở phần trước.
                      </FormDescription>
                      <div>
                        {checkoutInfo?.information?.buyerAddress.shortAddress}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className='text-mainColor1-600 font-medium text-lg'>
                        Địa chỉ gửi hàng
                      </FormLabel>
                      <FormDescription className='!mt-0'>
                        Địa chỉ shop hiện có sản phẩm.
                      </FormDescription>
                      <div>{shopAddresses[index]}</div>
                    </FormItem>
                  </div>

                  <div className='grid grid-cols-3 gap-6'>
                    <FormField
                      control={form.control}
                      name={`discountCode.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-mainColor1-600 font-medium text-lg mb-2'>
                            Áp dụng mã giảm giá
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Chọn mã giảm giá (nếu có)' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value='none' disabled>
                                  Không có
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Mã giảm giá sẽ áp dụng trên tổng giá trị đơn hàng.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`note.${index}`}
                      render={({ field }) => (
                        <FormItem className='col-span-2'>
                          <FormLabel className='text-mainColor1-600 font-medium text-lg mb-2'>
                            Ghi chú
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={
                                'placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-md focus:outline-none focus-visible:ring-0 focus:border-[2px] border'
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className=''>
                            Ghi chú thêm như thời gian vận chuyển, yêu cầu
                            khác,...
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`shippingMethod.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-mainColor1-600 font-medium text-lg mb-2'>
                          Dịch vụ vận chuyển
                        </FormLabel>
                        <FormDescription className='!mt-0'>
                          Chọn bất kì dịch vụ vận chuyển mà bạn muốn.
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            className='flex gap-2'
                            defaultValue={field.value}
                            onValueChange={(value) => {
                              field.onChange(value)
                              handleChooseShippingMethod(value, index)
                            }}
                          >
                            <FormItem className='border-input has-[:checked]:border-mainColor1-200 has-[:checked]:bg-mainColor1-100/20 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none'>
                              <FormControl>
                                <RadioGroupItem
                                  value={ShippingMethod.GHTK}
                                  id={`${id}-1`}
                                  aria-describedby={`${id}-1-description`}
                                  className='order-1 after:absolute after:inset-0'
                                />
                              </FormControl>

                              <div className='flex grow items-start gap-3'>
                                <Image
                                  src={ghtkLogo}
                                  alt=''
                                  width={30}
                                  height={30}
                                  className='size-[30px] rounded-sm'
                                />
                                <div className='grid grow gap-2'>
                                  <Label htmlFor={`${id}-1`}>
                                    Giao hàng tiết kiệm{' '}
                                    <span className='text-muted-foreground text-xs leading-[inherit] font-normal'>
                                      (Giao vào thứ 7)
                                    </span>
                                  </Label>
                                  <p
                                    id={`${id}-1-description`}
                                    className='text-muted-foreground text-xs'
                                  >
                                    Chi phí: 0đ - Free
                                  </p>
                                </div>
                              </div>
                            </FormItem>

                            <FormItem className='border-input has-[:checked]:border-mainColor1-200 has-[:checked]:bg-mainColor1-100/20 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none'>
                              <FormControl>
                                <RadioGroupItem
                                  value={ShippingMethod.GHN}
                                  id={`${id}-2`}
                                  aria-describedby={`${id}-2-description`}
                                  className='order-1 after:absolute after:inset-0'
                                  disabled={!!ghnServiceError}
                                />
                              </FormControl>
                              <div className='flex grow items-start gap-3'>
                                <Image
                                  src={ghnLogo}
                                  alt=''
                                  width={30}
                                  height={30}
                                  className='rounded-sm'
                                />
                                <div className='grid grow gap-2'>
                                  <Label htmlFor={`${id}-2`}>
                                    Giao hàng nhanh{' '}
                                    <span className='text-muted-foreground text-xs leading-[inherit] font-normal'>
                                      (Giao trong 2 giờ)
                                    </span>
                                  </Label>
                                  <p
                                    id={`${id}-2-description`}
                                    className='text-muted-foreground text-xs'
                                  >
                                    Chi phí:{' '}
                                    {shippingData[index]
                                      ? shippingData[
                                          index
                                        ][1]?.detail?.total?.toLocaleString()
                                      : 0}
                                    đ
                                  </p>
                                </div>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <div className='grid grid-cols-2 gap-2'>
                          <div className=''></div>
                          <div className='text-xs text-red-200'>
                            {ghnServiceError}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='col-span-3'>
                <RightSidebar
                  clusterOrder={clusterOrder}
                  checkoutInfo={checkoutInfo}
                  index={index}
                />
              </div>
            </div>
          ))}
          <div className='grid grid-cols-2 gap-5 my-10'>
            <Button
              type='button'
              className='border bg-white text-mainColor1-600  border-mainColor1-600 hover:bg-white text-md font-semibold rounded-lg hover:drop-shadow-xl'
              onClick={handleBack}
            >
              Quay lại
            </Button>
            <Button
              type='submit'
              className='bg-mainColor1-600 hover:bg-mainColor1-800 text-white text-md font-semibold rounded-lg hover:drop-shadow-xl'
            >
              Tiếp tục
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
