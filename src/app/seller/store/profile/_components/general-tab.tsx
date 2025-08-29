'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
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
import UploadAvatar from '@/components/upload-avatar'
import UploadImage from '@/components/UploadImage'
import { cn } from '@/lib/utils'
import { selectCurrentUser, updateUserAPI } from '@/redux/user/userSlice'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/validators'
import { z } from 'zod'
import { AccountStatus } from '@/types/enums/account'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppDispatch } from '@/redux/store'

const formSchema = z.object({
  name: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  foundedDate: z.date({ required_error: FIELD_REQUIRED_MESSAGE }),
  status: z.nativeEnum(AccountStatus),
  description: z.string()
})

export type GeneralTabFormSchemaType = z.infer<typeof formSchema>

export default function GeneralTab() {
  const id = useId()
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectCurrentUser)

  const form = useForm<GeneralTabFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser?.name || 'LEVI Store',
      foundedDate: currentUser?.foundedDate || undefined,
      status: AccountStatus.ACTIVE,
      description:
        currentUser?.description ||
        `
        ✨ LEVI Store - Thời Trang Đẳng Cấp, Phong Cách Bền Vững ✨
        Chào mừng bạn đến với LEVI Store, nơi mang đến những sản phẩm thời trang chất lượng cao, thiết kế tinh tế và đậm chất cá tính. Chúng tôi tự hào cung cấp các bộ sưu tập mới nhất, từ quần jeans, áo thun, sơ mi đến phụ kiện cao cấp, giúp bạn tự tin thể hiện phong cách riêng.
        💎 Cam kết của chúng tôi: <br />
        ✔ Sản phẩm chính hãng, chất lượng cao <br />
        ✔ Chính sách đổi trả linh hoạt, bảo hành uy tín <br />
        ✔ Giao hàng nhanh chóng, tiện lợi
      `
    }
  })

  const items = [
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Ngừng hoạt động' }
  ]

  const handleUpdateStoreGeneralInformation = (data: GeneralTabFormSchemaType) => {
    data.role = currentUser?.role
    toast.promise(dispatch(updateUserAPI(data)), {
      loading: 'Đang cập nhật...',
      success: (res) => {
        if (!res.error) return 'Cập nhật thành công!'
        throw res
      }
    })
  }

  return (
    <div className='bg-section rounded-lg p-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateStoreGeneralInformation)}>
          <div className='grid grid-cols-3 gap-4 mb-4'>
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
                        className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] ${
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
            </div>

            <div className='space-y-3'>
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

              <div className='space-y-2'>
                <FormLabel className='text-base'>Ảnh bìa</FormLabel>
                <UploadImage fieldName='coverPhoto' />
              </div>
            </div>

            <div>
              <Label className='text-base'>Ảnh đại diện</Label>
              <FormDescription>Click vào để tải ảnh lên.</FormDescription>
              <UploadAvatar
                className='mt-2 flex items-center justify-center flex-col'
                avatar={currentUser?.avatar}
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
                    className='placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] h-52'
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
            className='bg-mainColor1-800/85 rounded-lg w-full py-3 text-md'
          >
            Cập nhật chỉnh sửa
          </Button>
        </form>
      </Form>
    </div>
  )
}
