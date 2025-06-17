'use client'

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import envConfig from '@/config'
import { useLoading } from '@/contexts/LoadingContext'
import { AppDispatch } from '@/redux/store'
import { selectCurrentUser, updateUserAPI } from '@/redux/user/userSlice'
import { GhnDistrict, GhnProvince, GhnWard } from '@/types/entities/ghn'
import { Gender } from '@/types/enums/account'
import {
  FIELD_REQUIRED_MESSAGE,
  PHONE_NUMBER_RULE,
  PHONE_NUMBER_RULE_MESSAGE
} from '@/utils/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { z } from 'zod'

const LeftFormSchema = z.object({
  buyerAddress: z.object({
    province: z.number().int(FIELD_REQUIRED_MESSAGE),
    district: z.number().int(FIELD_REQUIRED_MESSAGE),
    ward: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }),
    address: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE })
  }),
  phone: z
    .string()
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
    .regex(PHONE_NUMBER_RULE, { message: PHONE_NUMBER_RULE_MESSAGE }),

  name: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }),
  gender: z.nativeEnum(Gender)
})

type LeftFormSchemaType = z.infer<typeof LeftFormSchema>

export default function ProfileLeftForm() {
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectCurrentUser)

  const leftForm = useForm<LeftFormSchemaType>({
    resolver: zodResolver(LeftFormSchema),
    defaultValues: {
      buyerAddress: currentUser?.buyerAddress?.[0] || {},
      phone: currentUser?.phone || '',
      name: currentUser?.name || '',
      gender: currentUser?.gender || Gender.MALE
    }
  })

  const handleLeftFormSubmit = (data: LeftFormSchemaType) => {
    const updateData = {
      ...data,
      buyerAddress: [data.buyerAddress],
      status: currentUser?.status,
      role: currentUser?.role
    }
    toast.promise(dispatch(updateUserAPI(updateData)), {
      loading: 'Đang cập nhật...',
      success: (res) => {
        if (!res.error) return 'Cập nhật thành công!'
        throw res
      }
    })
  }

  const [listProvinces, setListProvinces] = useState<GhnProvince[]>([])
  const [listDistricts, setListDistricts] = useState<GhnDistrict[]>([])
  const [listWards, setListWards] = useState<GhnWard[]>([])

  const [provinceId, setProvinceId] = useState(
    currentUser?.buyerAddress?.[0].province || null
  )
  const [districtId, setDistrictId] = useState(
    currentUser?.buyerAddress?.[0].district || null
  )
  const [wardId, setWardId] = useState(
    currentUser?.buyerAddress?.[0].ward || null
  )

  const { startLoading, endLoading } = useLoading()

  useEffect(() => {
    startLoading()
    fetch(
      'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
      {
        headers: { token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setListProvinces(data.data)
      })
      .finally(() => endLoading())
  }, [])

  useEffect(() => {
    startLoading()
    setListWards([])
    if (provinceId) {
      fetch(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
        {
          method: 'POST',
          headers: {
            token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            province_id: provinceId
          })
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.data?.length) setListDistricts(data.data)
        })
        .finally(() => endLoading())
    }
  }, [provinceId])

  useEffect(() => {
    startLoading()
    if (districtId) {
      fetch(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id',
        {
          method: 'POST',
          headers: {
            token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            district_id: districtId
          })
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.data?.length) setListWards(data.data)
        })
        .finally(() => endLoading())
    }
  }, [districtId])

  useEffect(() => {
    if (provinceId && districtId && wardId) {
      leftForm.setValue('buyerAddress', {
        province: provinceId,
        district: districtId,
        ward: wardId,
        address: leftForm.watch('buyerAddress.address')
      })
    }
  }, [
    provinceId,
    districtId,
    wardId,
    leftForm,
    listProvinces,
    listDistricts,
    listWards
  ])

  const getDetails = (data: { type: string, id: number | string}) => {
    if (data.type === 'province') setProvinceId(data.id as number)
    else if (data.type === 'district') setDistrictId(data.id as number)
    else setWardId(data.id as string)
  }

  return (
    <Form {...leftForm}>
      <form action='#' onSubmit={leftForm.handleSubmit(handleLeftFormSubmit)}>
        <FormField
          control={leftForm.control}
          name='name'
          render={({ field }) => (
            <FormItem className='mt-2 mb-4'>
              <FormLabel className='text-base'>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-full focus:outline-none focus:border-[2px] border-[1px] ${
                    !!leftForm.formState.errors['name'] && 'border-red-500'
                  }`}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Mặc định chúng tôi sẽ lấy họ và tên này in trên đơn hàng.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4 my-4'>
          <FormField
            control={leftForm.control}
            name='gender'
            render={({ field }) => (
              <FormItem className='my-3'>
                <FormLabel className='text-base'>Giới tính</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className='flex items-center gap-10 md:flex-col md:gap-4 md:items-start'
                  >
                    <FormItem className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='male' />
                      </FormControl>
                      <FormLabel className='font-normal'>Nam</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='female' />
                      </FormControl>
                      <FormLabel className='font-normal'>Nữ</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='other' />
                      </FormControl>
                      <FormLabel className='font-normal'>Khác</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={leftForm.control}
            name='phone'
            render={({ field }) => (
              <FormItem className='my-2'>
                <FormLabel className='text-base'>Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    placeholder='VD: 0123456789'
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-5 rounded-full focus:outline-none focus:border-[2px] border-[1px] ${
                      !!leftForm.formState.errors['phone'] && 'border-red-500'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Số điện thoại này được dùng để liên lạc với người vận chuyển.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={leftForm.control}
          name=''
          render={() => (
            <FormItem className='mb-10'>
              <FormLabel className='text-base'>Địa chỉ</FormLabel>
              <FormControl>
                <div className=''>
                  <div className='grid grid-cols-3 gap-4 mb-4'>
                    <FormField
                      control={leftForm.control}
                      name='buyerAddress.province'
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
                                !!leftForm.formState.errors?.buyerAddress
                                  ?.province
                              }
                              defaultValue={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={leftForm.control}
                      name='buyerAddress.district'
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
                                !!leftForm.formState.errors.buyerAddress
                                  ?.district
                              }
                              defaultValue={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={leftForm.control}
                      name='buyerAddress.ward'
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
                                !!leftForm.formState.errors?.buyerAddress?.ward
                              }
                              defaultValue={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={leftForm.control}
                    name='buyerAddress.address'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder='Vd: 123 đường ABC, phường X, quận Y, TPHCM'
                            className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-xl focus:outline-none focus:border-[2px] border border-mainColor1-100/50 ${
                              !!leftForm.formState.errors?.buyerAddress
                                ?.address && 'border-red-500'
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
                Địa chỉ nơi bạn cư trú.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-center'>
          <Button
            type='submit'
            className='w-[70%] rounded-full bg-mainColor2-800 text-white tex-lg uppercase'
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  )
}
