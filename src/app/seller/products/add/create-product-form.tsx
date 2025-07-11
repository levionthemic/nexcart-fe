'use client'

import clsx from 'clsx'
import { useFieldArray, useForm } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import UploadImage from '@/components/UploadImage'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/validators'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@/types/entities/category'
import { Brand } from '@/types/entities/brand'
import { useEffect, useState } from 'react'
import { createProductAPI, getShopsAPI } from '@/apis/sellerApis'
import { Shop } from '@/types/entities/shop'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  categoryId: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  brandId: z
    .string({ required_error: FIELD_REQUIRED_MESSAGE })
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  types: z
    .array(
      z.object({
        typeId: z
          .string({ required_error: FIELD_REQUIRED_MESSAGE })
          .min(1, { message: FIELD_REQUIRED_MESSAGE }),
        typeName: z
          .string({ required_error: FIELD_REQUIRED_MESSAGE })
          .min(1, { message: FIELD_REQUIRED_MESSAGE }),
        discount: z.coerce.number({ message: FIELD_REQUIRED_MESSAGE }).int(),
        price: z.coerce.number({ message: FIELD_REQUIRED_MESSAGE }).int()
      })
    )
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  shopTypes: z
    .array(
      z.object({
        shopId: z
          .string({ required_error: FIELD_REQUIRED_MESSAGE })
          .min(1, { message: FIELD_REQUIRED_MESSAGE }),
        typeId: z
          .string({ required_error: FIELD_REQUIRED_MESSAGE })
          .min(1, { message: FIELD_REQUIRED_MESSAGE }),
        stock: z.coerce.number({ message: FIELD_REQUIRED_MESSAGE }).int()
      })
    )
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  description: z.string(),
  // avatar: z.string().required(),
  features: z.array(
    z.object({
      field: z
        .string({ required_error: FIELD_REQUIRED_MESSAGE })
        .min(1, { message: FIELD_REQUIRED_MESSAGE }),
      content: z
        .string({ required_error: FIELD_REQUIRED_MESSAGE })
        .min(1, { message: FIELD_REQUIRED_MESSAGE })
    })
  ),
  width: z.coerce.number({ message: FIELD_REQUIRED_MESSAGE }).int(),
  length: z.coerce.number({ message: FIELD_REQUIRED_MESSAGE }).int(),
  height: z.coerce.number({ message: FIELD_REQUIRED_MESSAGE }).int(),
  weight: z.coerce.number({ message: FIELD_REQUIRED_MESSAGE }).int()
})

export type CreateProductFormSchemaType = z.infer<typeof formSchema>

export type CreateProductFormPropTypes = {
  categories: Category[]
  brands: Brand[]
}

export default function CreateProductForm({
  categories,
  brands
}: CreateProductFormPropTypes) {
  const [shops, setShops] = useState<Shop[]>([])
  useEffect(() => {
    getShopsAPI().then((data) => setShops(data))
  }, [])

  const router = useRouter()

  const form = useForm<CreateProductFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      brandId: '',
      types: [
        {
          typeId: uuidv4(),
          typeName: '',
          discount: undefined,
          price: undefined
        }
      ],
      shopTypes: [{ shopId: '', typeId: '', stock: undefined }],
      features: [{ field: '', content: '' }],
      description: ''
    }
  })

  const formFieldArrayForTypes = useFieldArray({
    control: form.control,
    name: 'types'
  })

  const formFieldArrayForFeatures = useFieldArray({
    control: form.control,
    name: 'features'
  })

  const formFieldArrayForShopTypes = useFieldArray({
    control: form.control,
    name: 'shopTypes'
  })

  const handleAddProduct = (data: CreateProductFormSchemaType) => {
    toast.promise(createProductAPI(data), {
      loading: 'Đang tạo sản phẩm...',
      success: () => {
        router.back()
        return 'Tạo sản phẩm thành công!'
      },
      error: 'Đã có lỗi!'
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleAddProduct)}
        className='space-y-4!'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='grid grid-cols-3 gap-2 mb-2'>
              <div className=''>
                <FormLabel>
                  Tên sản phẩm<span className='text-destructive'>*</span>
                </FormLabel>
                <FormDescription className=''>
                  Điền tên sản phẩm
                </FormDescription>
              </div>
              <div className='col-span-2'>
                <FormControl>
                  <Input
                    placeholder='Vd: Cửa hàng ABC'
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] ${
                      !!form.formState.errors['name'] && 'border-red-500'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='mt-2' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem className='grid grid-cols-3 mb-2'>
              <div className=''>
                <FormLabel>
                  Danh mục sản phẩm<span className='text-destructive'>*</span>
                </FormLabel>
                <FormDescription>Chọn danh mục sản phẩm</FormDescription>
              </div>

              <div className='col-span-2'>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn danh mục sản phẩm' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                  <FormMessage className='mt-2' />
                </Select>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='brandId'
          render={({ field }) => (
            <FormItem className='grid grid-cols-3 mb-2'>
              <div className=''>
                <FormLabel>
                  Thương hiệu sản phẩm
                  <span className='text-destructive'>*</span>
                </FormLabel>
                <FormDescription>Chọn thương hiệu sản phẩm</FormDescription>
              </div>

              <div className='col-span-2'>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn thương hiệu sản phẩm' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='mt-2' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='features'
          render={() => (
            <FormItem className='grid grid-cols-3 mb-2'>
              <div className=''>
                <FormLabel>Đặc điểm sản phẩm</FormLabel>
                <FormDescription>
                  Thêm các đặc điểm sản phẩm theo cặp. <br />
                  Nếu không có, vui lòng bấm &quot;Xóa&quot;.
                </FormDescription>
              </div>

              <div className='col-span-2'>
                {formFieldArrayForFeatures.fields.map((field, index) => (
                  <div key={field.id} className='flex gap-2 items-start mb-2'>
                    <FormField
                      control={form.control}
                      name={`features.${index}.field`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='Tên đặc điểm...' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`features.${index}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='Giá trị...' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant='destructive'
                      type='button'
                      onClick={() => formFieldArrayForFeatures.remove(index)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}

                <Button
                  type='button'
                  onClick={() =>
                    formFieldArrayForFeatures.append({
                      field: '',
                      content: ''
                    })
                  }
                  className={clsx({
                    'mt-1': formFieldArrayForFeatures.fields.length > 0
                  })}
                >
                  Thêm
                </Button>
                <FormMessage className='mt-2' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='weight'
          render={({ field }) => (
            <FormItem className='grid grid-cols-3 mb-2'>
              <div className=''>
                <FormLabel>
                  Cân nặng của sản phẩm
                  <span className='text-destructive'>*</span>
                </FormLabel>
                <FormDescription className=''>
                  Cung cấp cho việc tính toán phí vận chuyển. <br />
                  Tính bằng gram.
                </FormDescription>
              </div>
              <div className='col-span-2'>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Cân nặng (kg)'
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] w-1/2 ${
                      !!form.formState.errors.weight && 'border-red-500'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='mt-2' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='width'
          render={({ field }) => (
            <FormItem className='grid grid-cols-3 mb-2'>
              <div className=''>
                <FormLabel>
                  Kích thước chiều rộng của sản phẩm
                  <span className='text-destructive'>*</span>
                </FormLabel>
                <FormDescription className=''>
                  Cung cấp cho việc tính toán phí vận chuyển. <br />
                  Tính bằng cm.
                </FormDescription>
              </div>
              <div className='col-span-2'>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Chiều rộng (cm)'
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] w-1/2 ${
                      !!form.formState.errors.width && 'border-red-500'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='mt-2' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='length'
          render={({ field }) => (
            <FormItem className='grid grid-cols-3 mb-2'>
              <div className=''>
                <FormLabel>
                  Kích thước chiều dài của sản phẩm
                  <span className='text-destructive'>*</span>
                </FormLabel>
                <FormDescription className=''>
                  Cung cấp cho việc tính toán phí vận chuyển. <br />
                  Tính bằng cm.
                </FormDescription>
              </div>
              <div className='col-span-2'>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Chiều dài (cm)'
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] w-1/2 ${
                      !!form.formState.errors.length && 'border-red-500'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='mt-2' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='height'
          render={({ field }) => (
            <FormItem className='grid grid-cols-3 mb-2'>
              <div className=''>
                <FormLabel>
                  Kích thước chiều cao của sản phẩm
                  <span className='text-destructive'>*</span>
                </FormLabel>
                <FormDescription className=''>
                  Cung cấp cho việc tính toán phí vận chuyển. <br />
                  Tính bằng cm.
                </FormDescription>
              </div>
              <div className='col-span-2'>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Chiều cao (cm)'
                    className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] w-1/2 ${
                      !!form.formState.errors.height && 'border-red-500'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='mt-2' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='types'
          render={() => (
            <FormItem className='grid grid-cols-3 mb-2'>
              <div className=''>
                <FormLabel>
                  Thông tin loại sản phẩm
                  <span className='text-destructive'>*</span>
                </FormLabel>
                <FormDescription>
                  Thêm các loại sản phẩm với các trường tương ứng.
                  <br />Ô đầu tiên là mã loại tự sinh.
                </FormDescription>
              </div>

              <div className='col-span-2'>
                {formFieldArrayForTypes.fields.map((field, index) => (
                  <div key={field.id} className='flex gap-2 items-start mb-2'>
                    <FormField
                      control={form.control}
                      name={`types.${index}.typeId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder='Mã loại...'
                              {...field}
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`types.${index}.typeName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='Tên loại...' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`types.${index}.discount` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Giảm giá...'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`types.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Đơn giá...'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant='destructive'
                      type='button'
                      onClick={() => formFieldArrayForTypes.remove(index)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}

                <Button
                  type='button'
                  onClick={() =>
                    formFieldArrayForTypes.append({
                      typeId: '',
                      typeName: '',
                      discount: 0,
                      price: 0
                    })
                  }
                  className={clsx({
                    'mt-1': formFieldArrayForTypes.fields.length > 0
                  })}
                >
                  Thêm
                </Button>
                <FormMessage className='mt-2' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='shopTypes'
          render={() => (
            <FormItem className='grid grid-cols-3 mb-2'>
              <div className=''>
                <FormLabel>
                  Quản lý loại sản phẩm trong từng shop
                  <span className='text-destructive'>*</span>
                </FormLabel>
                <FormDescription>
                  Thêm các loại sản phẩm vào các shop với số lượng tương ứng
                </FormDescription>
              </div>

              <div className='col-span-2'>
                {formFieldArrayForShopTypes.fields.map((field, index) => (
                  <div key={field.id} className='flex gap-2 items-start mb-2'>
                    <FormField
                      control={form.control}
                      name={`shopTypes.${index}.shopId`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Tên shop...' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {shops.map((shop, index) => (
                                <SelectItem key={shop.id} value={shop.id}>
                                  Cửa hàng {index + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`shopTypes.${index}.typeId`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Tên loại...' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {form.watch('types').map((type) => (
                                <SelectItem
                                  key={type.typeId}
                                  value={type.typeId || 'Chưa có loại'}
                                >
                                  {type.typeName || 'Chưa có loại'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`shopTypes.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Số lượng...'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant='destructive'
                      type='button'
                      onClick={() => formFieldArrayForShopTypes.remove(index)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}

                <Button
                  type='button'
                  onClick={() =>
                    formFieldArrayForShopTypes.append({
                      shopId: '',
                      typeId: '',
                      stock: 0
                    })
                  }
                  className={clsx({
                    'mt-1': formFieldArrayForShopTypes.fields.length > 0
                  })}
                >
                  Thêm
                </Button>
                <FormMessage className='mt-2' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='grid grid-cols-3 mb-2'>
              <div className=''>
                <FormLabel className='text-base'>Mô tả</FormLabel>
                <FormDescription className=''>
                  Ghi mô tả sản phẩm
                </FormDescription>
              </div>
              <FormControl className='col-span-2'>
                <Textarea
                  placeholder='Vd: Mô tả của sản phẩm'
                  className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] ${
                    !!form.formState.errors['description'] && 'border-red-500'
                  }`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormItem className='grid grid-cols-3 mb-2'>
          <div className=''>
            <FormLabel className='text-base'>Hình ảnh</FormLabel>
            <FormDescription className=''>
              Upload hình ảnh mặc định của sản phẩm
            </FormDescription>
          </div>
          <FormControl className='col-span-2'>
            {/* <Input
                      type='number'
                      placeholder="Vd: Cửa hàng ABC"
                      className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] ${!!form.formState.errors['discount'] && 'border-red-500'}`}
                      {...field}
                    /> */}
            <UploadImage fieldName='' />
          </FormControl>
        </FormItem>

        <div>
          <Button type='submit' className='mt-10 w-full'>
            Tạo sản phẩm
          </Button>
        </div>
      </form>
    </Form>
  )
}
