'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { AppDispatch } from '@/redux/store'
import { selectCurrentUser, updateUserAction } from '@/redux/user/userSlice'
import { AccountStatus } from '@/types/enums/account'
import { objectToFormData } from '@/utils/helpers'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/validators'

import UploadAvatar from './upload-avatar'
import UploadCoverPhoto from './upload-cover-photo'

const formSchema = z.object({
  name: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  foundedDate: z.coerce.date(),
  status: z.nativeEnum(AccountStatus),
  description: z.string().optional(),
  avatar: z.union([
    z
      .custom<File>((file) => file instanceof File, {
        message: 'Bắt buộc cung cấp ảnh!'
      })
      .refine((file) => file.size <= 2 * 1024 * 1024, {
        message: 'Ảnh tối đa 2MB'
      })
      .refine(
        (file) => {
          return file ? ['image/jpeg', 'image/png'].includes(file.type) : false
        },
        { message: 'Chỉ chấp nhận JPG/PNG' }
      ),
    z.string().optional()
  ]),
  cover_photo: z
    .custom<File>((file) => file instanceof File, {
      message: 'Bắt buộc cung cấp ảnh!'
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: 'Ảnh tối đa 2MB'
    })
    .refine(
      (file) => {
        return file ? ['image/jpeg', 'image/png'].includes(file.type) : false
      },
      { message: 'Chỉ chấp nhận JPG/PNG' }
    )
})

export type GeneralTabFormSchemaType = z.infer<typeof formSchema>

export default function GeneralTab() {
  const id = useId()
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectCurrentUser)

  const form = useForm<GeneralTabFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser?.seller?.name || 'LEVI Store',
      foundedDate: currentUser?.seller?.foundedDate || undefined,
      status: AccountStatus.ACTIVE,
      description: currentUser?.seller?.description || '',
      avatar: currentUser?.avatar
    }
  })

  const items = [
    { value: AccountStatus.ACTIVE, label: 'Bình thường' },
    { value: AccountStatus.BANNED, label: 'Bị cấm' },
    { value: AccountStatus.PENDING_VERIFICATION, label: 'Chờ xác thực' },
    { value: AccountStatus.DEACTIVATED, label: 'Ngừng hoạt động' }
  ]

  const handleUpdateStoreGeneralInformation = (
    data: GeneralTabFormSchemaType
  ) => {
    toast.promise(dispatch(updateUserAction(objectToFormData(data))).unwrap(), {
      loading: 'Đang xử lý',
      success: 'Cập nhật thành công',
      error: (err) => err.message
    })
  }

  return (
    <div className='bg-section rounded-lg p-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateStoreGeneralInformation)}>
          <div className='mb-4 grid grid-cols-3 gap-8'>
            <div className='space-y-3'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>Tên cửa hàng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Vd: Cửa hàng ABC'
                        className={`placeholder:text-opacity-50 rounded-lg border-[1px] placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
                          !!form.formState.errors['name'] && 'border-red-500'
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className=''>
                      Bạn có thể thay đổi tên cửa hàng.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='foundedDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='text-base'>Ngày thành lập</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Chọn ngày thành lập</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Bạn không thể thay đổi ngày thành lập.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>
                      Trạng thái cửa hàng
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        className='flex flex-wrap gap-2'
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        {items.map((item) => (
                          <div
                            key={`${id}-${item.value}`}
                            className='border-input has-data-[state=checked]:border-ring relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none'
                          >
                            <div className='flex items-center gap-2'>
                              <RadioGroupItem
                                id={`${id}-${item.value}`}
                                value={item.value}
                                className='after:absolute after:inset-0'
                              />
                              <Label htmlFor={`${id}-${item.value}`}>
                                {item.label}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription className=''>
                      Trạng thái hoạt động hiện tại của cửa hàng.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name='cover_photo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>
                      Ảnh nền<span className='text-destructive'>*</span>
                    </FormLabel>

                    <FormControl className='col-span-2'>
                      <UploadCoverPhoto
                        fieldName={field.name}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>
                      Ảnh đại diện<span className='text-destructive'>*</span>
                    </FormLabel>

                    <FormControl className='col-span-2'>
                      <UploadAvatar
                        fieldName={field.name}
                        defaultImageUrl={field.value as string}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='mb-8'>
                <FormLabel className='text-base'>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    className='placeholder:text-opacity-50 h-52 rounded-lg border-[1px] placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription className=''>
                  Mô tả cửa hàng của bạn.
                </FormDescription>
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='bg-mainColor1-800/85 text-md w-full rounded-lg py-3'
          >
            Cập nhật chỉnh sửa
          </Button>
        </form>
      </Form>
    </div>
  )
}
