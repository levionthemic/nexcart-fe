'use client'

import { createAddressApi } from '@/apis/address.api'
import {
  getListDistrictsByProvinceIdApi,
  getListProvincesApi,
  getListWardsByDistrictIdApi
} from '@/apis/ghn.api'
import Autocomplete from '@/components/Autocomplete'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AppDispatch } from '@/redux/store'
import { setUser } from '@/redux/user/userSlice'

import { GhnDistrict, GhnProvince, GhnWard } from '@/types/entities/ghn'

import { FIELD_REQUIRED_MESSAGE } from '@/utils/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { z } from 'zod'

const addAddressFormSchema = z.object({
  province_id: z.number({ message: FIELD_REQUIRED_MESSAGE }),
  district_id: z.number({ message: FIELD_REQUIRED_MESSAGE }),
  ward_code: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  address: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
})
export type AddAddressFormSchemaType = z.infer<typeof addAddressFormSchema>

export default function AddAddress({
  className,
  triggerParentRender
}: {
  className: string
  triggerParentRender: () => void
}) {
  const addAddressForm = useForm<AddAddressFormSchemaType>({
    resolver: zodResolver(addAddressFormSchema),
    defaultValues: {
      province_id: 0,
      district_id: 0,
      ward_code: '',
      address: ''
    }
  })

  const [listProvinces, setListProvinces] = useState<GhnProvince[]>([])
  const [listDistricts, setListDistricts] = useState<GhnDistrict[]>([])
  const [listWards, setListWards] = useState<GhnWard[]>([])

  const [province_id, setProvince_id] = useState<number>(0)

  const [district_id, setDistrict_id] = useState<number>(0)
  const [ward_code, setWard_code] = useState<string>('')

  const [open, setOpen] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    getListProvincesApi().then((data) => {
      if (data) {
        setListProvinces(data)
      }
    })
  }, [])

  useEffect(() => {
    setListWards([])
    if (province_id) {
      getListDistrictsByProvinceIdApi(province_id).then((data) => {
        if (data && data.length) setListDistricts(data)
      })
    }
  }, [province_id])

  useEffect(() => {
    if (district_id) {
      getListWardsByDistrictIdApi(district_id).then((data) => {
        if (data && data.length) setListWards(data)
      })
    }
  }, [district_id])

  useEffect(() => {
    if (province_id && district_id && ward_code) {
      addAddressForm.setValue('province_id', province_id)
      addAddressForm.setValue('district_id', district_id)
      addAddressForm.setValue('ward_code', ward_code)
      addAddressForm.setValue('address', addAddressForm.watch('address'))
    }
  }, [
    province_id,
    district_id,
    ward_code,
    addAddressForm,
    listProvinces,
    listDistricts,
    listWards
  ])

  const getDetails = (data: { type: string; id: number | string }) => {
    if (data.type === 'province') setProvince_id(data.id as number)
    else if (data.type === 'district') setDistrict_id(data.id as number)
    else setWard_code(data.id as string)
  }

  const onSubmit = (data: AddAddressFormSchemaType) => {
    toast.promise(createAddressApi(data), {
      loading: 'Đang xử lý...',
      success: async () => {
        const userData = await fetch('/api/me', {
          credentials: 'include'
        }).then((res) => res.json())
        dispatch(setUser(userData))
        setOpen(false)
        triggerParentRender()
        return 'Thêm địa chỉ thành công!'
      },
      error: (error) => error.message
    })
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className={`flex items-center gap-1 ${className}`}
        >
          <Plus />
          Thêm địa chỉ
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-[650px]'>
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ</DialogTitle>
          <DialogDescription>
            Đây sẽ là địa chỉ nhận hàng của bạn.
          </DialogDescription>
        </DialogHeader>
        <Form {...addAddressForm}>
          <form
            action='#'
            onSubmit={addAddressForm.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-3 gap-4 mb-4'>
              <FormField
                control={addAddressForm.control}
                name='province_id'
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
                        error={!!addAddressForm.formState.errors?.province_id}
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addAddressForm.control}
                name='district_id'
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
                        error={!!addAddressForm.formState.errors?.district_id}
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addAddressForm.control}
                name='ward_code'
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
                        error={!!addAddressForm.formState.errors?.ward_code}
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
              control={addAddressForm.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Vd: 123 đường ABC, phường X, quận Y, TPHCM'
                      className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-xl focus:outline-none focus:border-[2px] border border-mainColor1-100/50 ${
                        !!addAddressForm.formState.errors?.address &&
                        'border-red-500'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-end'>
              <Button type='submit'>Thêm địa chỉ</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
