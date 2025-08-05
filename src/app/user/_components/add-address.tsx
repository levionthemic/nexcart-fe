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
  provinceId: z.number({ message: FIELD_REQUIRED_MESSAGE }),
  districtId: z.number({ message: FIELD_REQUIRED_MESSAGE }),
  wardCode: z
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
    resolver: zodResolver(addAddressFormSchema)
  })
  const [listProvinces, setListProvinces] = useState<GhnProvince[]>([])
  const [listDistricts, setListDistricts] = useState<GhnDistrict[]>([])
  const [listWards, setListWards] = useState<GhnWard[]>([])

  const [provinceId, setProvinceId] = useState<number>(0)

  const [districtId, setDistrictId] = useState<number>(0)
  const [wardCode, setWardCode] = useState<string>('')

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
    if (provinceId && districtId && wardCode) {
      addAddressForm.setValue('provinceId', provinceId)
      addAddressForm.setValue('districtId', districtId)
      addAddressForm.setValue('wardCode', wardCode)
      addAddressForm.setValue('address', addAddressForm.watch('address'))
    }
  }, [
    provinceId,
    districtId,
    wardCode,
    addAddressForm,
    listProvinces,
    listDistricts,
    listWards
  ])

  const getDetails = (data: { type: string; id: number | string }) => {
    if (data.type === 'province') setProvinceId(data.id as number)
    else if (data.type === 'district') setDistrictId(data.id as number)
    else setWardCode(data.id as string)
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
                name='provinceId'
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
                        error={!!addAddressForm.formState.errors?.provinceId}
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
                name='districtId'
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
                        error={!!addAddressForm.formState.errors?.districtId}
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
                name='wardCode'
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
                        error={!!addAddressForm.formState.errors?.wardCode}
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
