'use client'

import { addNewShopAPI } from '@/apis/sellerApis'
import Autocomplete from '@/components/Autocomplete'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import envConfig from '@/config'
import { GhnDistrict, GhnProvince, GhnWard } from '@/types/entities/ghn'
import {
  FIELD_REQUIRED_MESSAGE,
  PHONE_NUMBER_RULE,
  PHONE_NUMBER_RULE_MESSAGE
} from '@/utils/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  phone: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
    .regex(PHONE_NUMBER_RULE, { message: PHONE_NUMBER_RULE_MESSAGE }),
  provinceId: z.number({ message: FIELD_REQUIRED_MESSAGE }),
  districtId: z.number({ message: FIELD_REQUIRED_MESSAGE }),
  wardCode: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  address: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
})

export type AddShopFormSchemaType = z.infer<typeof formSchema>

export default function AddShopDialog({
  trigger
}: {
  trigger: React.ReactNode
}) {
  const form = useForm<AddShopFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      provinceId: undefined,
      districtId: undefined,
      wardCode: '',
      address: ''
    }
  })

  const [listProvinces, setListProvinces] = useState<GhnProvince[]>([])
  const [listDistricts, setListDistricts] = useState<GhnDistrict[]>([])
  const [listWards, setListWards] = useState<GhnWard[]>([])

  const [provinceId, setProvinceId] = useState<number>()
  const [districtId, setDistrictId] = useState<number>()
  const [wardCode, setWardCode] = useState<string>('')

  useEffect(() => {
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
  }, [])

  useEffect(() => {
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
    }
  }, [provinceId])

  useEffect(() => {
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
    }
  }, [districtId])

  useEffect(() => {
    form.setValue('provinceId', Number(provinceId))
    form.setValue('districtId', Number(districtId))
    form.setValue('wardCode', String(wardCode))
  }, [provinceId, districtId, wardCode, form])

  const getDetails = (data: { id: string | number; type: string }) => {
    if (data.type === 'province') setProvinceId(Number(data.id))
    else if (data.type === 'district') setDistrictId(Number(data.id))
    else setWardCode(String(data.id))
  }

  const [open, setOpen] = useState(false)
  const handleSubmit = (data: AddShopFormSchemaType) => {
    toast.promise(addNewShopAPI(data), {
      loading: 'Đang xử lý...',
      success: 'Tạo shop thành công!',
      error: 'Đã có lỗi!'
    })
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Tạo mới cửa hàng</DialogTitle>
          <DialogDescription>
            Điền các thông tin cơ bản của shop mà bạn muốn tạo
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-8'
          >
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại cửa hàng</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Vd: 0123456789'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className='text-base'>Địa chỉ cửa hàng</FormLabel>
              <FormControl>
                <div className=''>
                  <div className='grid grid-cols-3 gap-10 mb-4'>
                    <FormField
                      control={form.control}
                      name='provinceId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tỉnh/thành</FormLabel>
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
                              error={!!form.formState.errors.provinceId}
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
                      name='districtId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quận/huyện</FormLabel>
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
                              error={!!form.formState.errors.districtId}
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
                      name='wardCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phường/xã</FormLabel>
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
                              error={!!form.formState.errors.wardCode}
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
                    name='address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ + đường/ấp</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Vd: 123 đường ABC'
                            className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-xl focus:outline-none focus:border-[2px] border border-mainColor1-100/50 ${
                              !!form.formState.errors.address &&
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
              <FormMessage />
            </FormItem>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Hủy</Button>
              </DialogClose>
              <Button type='submit'>Tạo mới</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
