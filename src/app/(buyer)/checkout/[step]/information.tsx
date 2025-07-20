'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Autocomplete from '@/components/Autocomplete'
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
import { Input } from '@/components/ui/input'
import { selectCurrentUser } from '@/redux/user/userSlice'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PHONE_NUMBER_RULE,
  PHONE_NUMBER_RULE_MESSAGE
} from '@/utils/validators'
import { z } from 'zod'
import { GhnDistrict, GhnProvince, GhnWard } from '@/types/entities/ghn'
import { useOrder } from '@/contexts/order-context'
import { useRouter } from 'next/navigation'
import {
  getListDistrictsByProvinceIdApi,
  getListProvincesApi,
  getListWardsByDistrictIdApi
} from '@/apis/ghn.api'

const formSchema = z.object({
  name: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  email: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
    .regex(EMAIL_RULE, { message: EMAIL_RULE_MESSAGE }),
  phone: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
    .regex(PHONE_NUMBER_RULE, { message: PHONE_NUMBER_RULE_MESSAGE }),
  buyerAddress: z.object({
    provinceId: z.number({ message: FIELD_REQUIRED_MESSAGE }),
    districtId: z.number({ message: FIELD_REQUIRED_MESSAGE }),
    wardCode: z
      .string({ required_error: FIELD_REQUIRED_MESSAGE })
      .min(1, { message: FIELD_REQUIRED_MESSAGE }),
    address: z
      .string({ required_error: FIELD_REQUIRED_MESSAGE })
      .min(1, { message: FIELD_REQUIRED_MESSAGE })
  })
})

export type InformationFormSchemaType = z.infer<typeof formSchema>

export default function Information() {
  const currentUser = useSelector(selectCurrentUser)
  const router = useRouter()

  const [listProvinces, setListProvinces] = useState<GhnProvince[]>([])
  const [listDistricts, setListDistricts] = useState<GhnDistrict[]>([])
  const [listWards, setListWards] = useState<GhnWard[]>([])

  const { checkoutInfo, setCheckoutInfo } = useOrder()

  const defaultBuyerAddress = currentUser?.buyer?.addresses?.find(
    (a) => a.isDefault
  )

  const [provinceId, setProvinceId] = useState(
    checkoutInfo?.information?.buyerAddress.provinceId ||
      defaultBuyerAddress?.provinceId
  )
  const [districtId, setDistrictId] = useState(
    checkoutInfo?.information?.buyerAddress.districtId ||
      defaultBuyerAddress?.districtId
  )
  const [wardId, setWardId] = useState(
    checkoutInfo?.information?.buyerAddress.wardCode ||
      defaultBuyerAddress?.wardCode
  )

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (checkoutInfo) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [checkoutInfo])

  const form = useForm<InformationFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyerAddress: checkoutInfo?.information?.buyerAddress ||
        defaultBuyerAddress || {
          address: ''
        },
      email: checkoutInfo?.information?.email || currentUser?.email || '',
      name: checkoutInfo?.information?.name || currentUser?.name || '',
      phone: checkoutInfo?.information?.phone || currentUser?.phone || ''
    }
  })

  useEffect(() => {
    getListProvincesApi().then((data) => {
      if (data) {
        setListProvinces(data)
      }
    })
  }, [])

  useEffect(() => {
    setListWards([])
    if (provinceId) {
      getListDistrictsByProvinceIdApi(provinceId).then((data) => {
        if (data && data.length) setListDistricts(data)
      })
    }
  }, [provinceId])

  useEffect(() => {
    if (districtId) {
      getListWardsByDistrictIdApi(districtId).then((data) => {
        if (data && data.length) setListWards(data)
      })
    }
  }, [districtId])

  useEffect(() => {
    form.setValue('buyerAddress', {
      provinceId: Number(provinceId),
      districtId: Number(districtId),
      wardCode: String(wardId),
      address: form.watch('buyerAddress.address')
    })
  }, [
    provinceId,
    districtId,
    wardId,
    form,
    listProvinces,
    listDistricts,
    listWards
  ])

  const getDetails = (data: { id: string | number; type: string }) => {
    if (data.type === 'province') setProvinceId(Number(data.id))
    else if (data.type === 'district') setDistrictId(Number(data.id))
    else setWardId(String(data.id))
  }

  const handleUpdateUser = (data: InformationFormSchemaType) => {
    const buyerAddress = data.buyerAddress

    const wardName = listWards.find(
      (i) => i.WardCode === buyerAddress.wardCode
    )?.WardName
    const districtName = listDistricts.find(
      (i) => i.DistrictID === buyerAddress.districtId
    )?.DistrictName
    const provinceName = listProvinces.find(
      (i) => i.ProvinceID === buyerAddress.provinceId
    )?.ProvinceName

    const shortAddress = `${buyerAddress.address}, ${wardName}, ${districtName}, ${provinceName}`

    const updatedCheckoutInfo = {
      information: { ...data, shortAddress: shortAddress }
    }

    setCheckoutInfo(updatedCheckoutInfo)
    router.push('/checkout/2')
  }

  return (
    <div className='my-6 border border-b-[#ddd] rounded-md p-4 w-[95%]'>
      <div className='text-mainColor1-600 font-medium text-lg'>
        Thông tin người nhận
      </div>
      <p className='text-sm text-muted-foreground mb-4'>
        Mặc định sẽ lấy thông tin cá nhân trong tài khoản của bạn. Bạn có thể
        thay đổi chúng nếu muốn.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateUser)}
          className='space-y-8'
        >
          <div className='grid grid-cols-3 gap-14'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Họ và tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Vd: Nguyễn Văn A'
                      className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-xl focus:outline-none focus:border-[2px] border border-mainColor1-100/50 ${
                        !!form.formState.errors['name'] && 'border-red-500'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=''>
                    Họ và tên này sẽ được in trên đơn vận chuyển.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Vd: example@levionthemic.com'
                      className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-xl focus:outline-none focus:border-[2px] border border-mainColor1-100/50 ${
                        !!form.formState.errors['email'] && 'border-red-500'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=''>
                    Email này sẽ được in trên đơn vận chuyển.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Vd: 0123456789'
                      className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-xl focus:outline-none focus:border-[2px] border border-mainColor1-100/50 ${
                        !!form.formState.errors['phone'] && 'border-red-500'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=''>
                    Người vận chuyển sẽ liên hệ bạn qua số điện thoại này.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='buyerAddress'
            render={() => (
              <FormItem>
                <FormLabel className='text-base'>Địa chỉ</FormLabel>
                <FormControl>
                  <div className=''>
                    <div className='grid grid-cols-3 gap-10 mb-4'>
                      <FormField
                        control={form.control}
                        name='buyerAddress.provinceId'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Autocomplete
                                data={listProvinces?.map((i) => ({
                                  value: i.ProvinceID,
                                  label: i.ProvinceName,
                                  id: i.ProvinceID
                                }))}
                                title={'Tỉnh/thành'}
                                getDetails={getDetails}
                                flag={'province'}
                                error={
                                  !!form.formState.errors.buyerAddress?.provinceId
                                }
                                defaultValue={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='buyerAddress.districtId'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Autocomplete
                                data={listDistricts?.map((i) => ({
                                  value: i.DistrictID,
                                  label: i.DistrictName,
                                  id: i.DistrictID
                                }))}
                                title={'Quận/huyện'}
                                getDetails={getDetails}
                                flag={'district'}
                                error={
                                  !!form.formState.errors.buyerAddress?.districtId
                                }
                                defaultValue={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='buyerAddress.wardCode'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Autocomplete
                                data={listWards?.map((i) => ({
                                  value: i.WardCode,
                                  label: i.WardName,
                                  id: i.WardCode
                                }))}
                                title={'Phường/xã'}
                                getDetails={getDetails}
                                flag={'ward'}
                                error={
                                  !!form.formState.errors.buyerAddress?.wardCode
                                }
                                defaultValue={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name='buyerAddress.address'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder='Vd: 123 đường ABC'
                              className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-xl focus:outline-none focus:border-[2px] border border-mainColor1-100/50 ${
                                !!form.formState.errors.buyerAddress?.address &&
                                'border-red-500'
                              }`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormDescription className=''>
                  Địa chỉ nhận hàng của bạn.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 gap-5'>
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
