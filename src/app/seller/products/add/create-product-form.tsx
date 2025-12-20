'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { getShopsApi } from '@/apis/shop.api'
import Autocomplete from '@/components/shared/autocomplete'
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Brand } from '@/types/entities/brand'
import { Category } from '@/types/entities/category'
import { Shop } from '@/types/entities/shop'
import { generateSKU } from '@/utils/helpers'
import {
  FIELD_REQUIRED_MESSAGE,
  STRING_CONTAIN_NUMBER_RULE,
  STRING_CONTAIN_NUMBER_RULE_MESSAGE
} from '@/utils/validators'

import UploadImage from './upload-image'

const formSchema = z.object({
  name: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }),
  description: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }),
  category_id: z.coerce.number({ message: FIELD_REQUIRED_MESSAGE }).int(),
  brand_id: z.coerce.number({ message: FIELD_REQUIRED_MESSAGE }).int(),
  thumbnail_url: z
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
  specifications: z.array(
    z.object({
      field: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }),
      content: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE })
    })
  ),
  product_variants: z
    .array(
      z.object({
        sku: z.string().min(13).max(13),
        name: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }),
        discount: z
          .string()
          .min(1, { message: FIELD_REQUIRED_MESSAGE })
          .regex(STRING_CONTAIN_NUMBER_RULE, {
            message: STRING_CONTAIN_NUMBER_RULE_MESSAGE
          }),
        price: z
          .string()
          .min(1, { message: FIELD_REQUIRED_MESSAGE })
          .regex(STRING_CONTAIN_NUMBER_RULE, {
            message: STRING_CONTAIN_NUMBER_RULE_MESSAGE
          }),
        width: z
          .string()
          .min(1, { message: FIELD_REQUIRED_MESSAGE })
          .regex(STRING_CONTAIN_NUMBER_RULE, {
            message: STRING_CONTAIN_NUMBER_RULE_MESSAGE
          }),
        length: z
          .string()
          .min(1, { message: FIELD_REQUIRED_MESSAGE })
          .regex(STRING_CONTAIN_NUMBER_RULE, {
            message: STRING_CONTAIN_NUMBER_RULE_MESSAGE
          }),
        height: z
          .string()
          .min(1, { message: FIELD_REQUIRED_MESSAGE })
          .regex(STRING_CONTAIN_NUMBER_RULE, {
            message: STRING_CONTAIN_NUMBER_RULE_MESSAGE
          }),
        weight: z
          .string()
          .min(1, { message: FIELD_REQUIRED_MESSAGE })
          .regex(STRING_CONTAIN_NUMBER_RULE, {
            message: STRING_CONTAIN_NUMBER_RULE_MESSAGE
          })
      })
    )
    .min(1, { message: FIELD_REQUIRED_MESSAGE }),
  shop_product_variants: z
    .array(
      z.object({
        shop_id: z.number().int(),
        product_variant_sku: z
          .string()
          .min(1, { message: FIELD_REQUIRED_MESSAGE }),
        stock_quantity: z.coerce
          .number({ message: FIELD_REQUIRED_MESSAGE })
          .int()
      })
    )
    .min(1, { message: FIELD_REQUIRED_MESSAGE })
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
    getShopsApi().then((data) => setShops(data || []))
  }, [])

  const form = useForm<CreateProductFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      specifications: [{ field: '', content: '' }],
      product_variants: [
        {
          sku: generateSKU(),
          name: '',
          discount: '',
          price: '',
          width: '',
          height: '',
          weight: '',
          length: ''
        }
      ],
      shop_product_variants: []
    }
  })

  const formFieldArrayForProductVariants = useFieldArray({
    control: form.control,
    name: 'product_variants'
  })

  const formFieldArrayForSpecifications = useFieldArray({
    control: form.control,
    name: 'specifications'
  })

  const formFieldArrayForShopProductVariants = useFieldArray({
    control: form.control,
    name: 'shop_product_variants'
  })

  const handleAddProduct = (data: CreateProductFormSchemaType) => {
    // toast.promise(createProductApi(data), {
    //   loading: 'Đang tạo sản phẩm...',
    //   success: () => {
    //     router.back()
    //     return 'Tạo sản phẩm thành công!'
    //   },
    //   error: 'Đã có lỗi!'
    // })
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4!'
        onSubmit={form.handleSubmit(handleAddProduct)}
      >
        <div className='text-mainColor1-600 mb-2 text-lg font-medium'>
          Phần 1: Thông tin về sản phẩm
        </div>

        <div className='grid grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên sản phẩm<span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Vd: Cửa hàng ABC'
                      className={`placeholder:text-opacity-50 rounded-lg border-[1px] placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
                        !!form.formState.errors['name'] && 'border-red-500'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-8'>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='category_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Danh mục sản phẩm
                        <span className='text-destructive'>*</span>
                      </FormLabel>

                      <FormControl>
                        <Autocomplete
                          data={categories?.map((i) => ({
                            value: i.name,
                            label: i.name,
                            id: i.id
                          }))}
                          title={'Chọn danh mục...'}
                          flag={'brand_id'}
                          error={!!form.formState.errors.category_id}
                          defaultValue={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='brand_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Thương hiệu sản phẩm
                        <span className='text-destructive'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Autocomplete
                          data={brands?.map((i) => ({
                            value: i.name,
                            label: i.name,
                            id: i.id
                          }))}
                          title={'Chọn thương hiệu...'}
                          flag={'brand_id'}
                          error={!!form.formState.errors.brand_id}
                          defaultValue={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=''>
                <FormField
                  control={form.control}
                  name='thumbnail_url'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base'>
                        Hình ảnh<span className='text-destructive'>*</span>
                      </FormLabel>

                      <FormControl className='col-span-2'>
                        <UploadImage
                          fieldName={field.name}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className=''>
            <FormField
              control={form.control}
              name='specifications'
              render={() => (
                <FormItem className='mb-2 grid grid-cols-3'>
                  <div className=''>
                    <FormLabel>Đặc điểm sản phẩm</FormLabel>
                    <FormDescription>
                      Thêm các đặc điểm sản phẩm theo cặp. <br />
                      Nếu không có, vui lòng bấm &quot;Xóa&quot;.
                    </FormDescription>
                  </div>

                  <div className='col-span-2'>
                    {formFieldArrayForSpecifications.fields.map(
                      (field, index) => (
                        <div
                          key={field.id}
                          className='mb-2 flex items-start gap-2'
                        >
                          <FormField
                            control={form.control}
                            name={`specifications.${index}.field`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder='Tên đặc điểm...'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`specifications.${index}.content`}
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
                            onClick={() =>
                              formFieldArrayForSpecifications.remove(index)
                            }
                          >
                            Xóa
                          </Button>
                        </div>
                      )
                    )}

                    <Button
                      type='button'
                      onClick={() =>
                        formFieldArrayForSpecifications.append({
                          field: '',
                          content: ''
                        })
                      }
                      className={clsx({
                        'mt-1':
                          formFieldArrayForSpecifications.fields.length > 0
                      })}
                    >
                      Thêm
                    </Button>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base'>Mô tả</FormLabel>

              <FormControl className='col-span-2'>
                <Textarea
                  placeholder='Vd: Mô tả của sản phẩm'
                  rows={10}
                  className={`placeholder:text-opacity-50 rounded-lg border-[1px] placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
                    !!form.formState.errors['description'] && 'border-red-500'
                  }`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className='border-mainColor2-300 my-8! border' />

        <div className='text-mainColor1-600 mb-2 text-lg font-medium'>
          Phần 2: Thông tin về các biến thể sản phẩm
        </div>

        <div className='space-y-10'>
          <FormField
            control={form.control}
            name='product_variants'
            render={() => (
              <FormItem>
                <FormLabel>
                  Thông tin biến thể sản phẩm
                  <span className='text-destructive'>*</span>
                </FormLabel>

                <div>
                  {formFieldArrayForProductVariants.fields.map(
                    (field, index) => (
                      <div
                        key={field.id}
                        className='mb-2 flex items-start gap-2'
                      >
                        <FormField
                          control={form.control}
                          name={`product_variants.${index}.sku`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder='SKU...'
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
                          name={`product_variants.${index}.name`}
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
                          name={`product_variants.${index}.discount` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder='Giảm giá...' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`product_variants.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder='Đơn giá...' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`product_variants.${index}.weight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder='Cân nặng (g)'
                                  // className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] w-1/2 ${
                                  //   !!form.formState.errors.product_variants?.weight &&
                                  //   'border-red-500'
                                  // }`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`product_variants.${index}.width`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder='Chiều rộng (cm)'
                                  // className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] w-1/2 ${
                                  //   !!form.formState.errors.width &&
                                  //   'border-red-500'
                                  // }`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`product_variants.${index}.length`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder='Chiều dài (cm)'
                                  // className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] w-1/2 ${
                                  //   !!form.formState.errors.length &&
                                  //   'border-red-500'
                                  // }`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`product_variants.${index}.height`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder='Chiều cao (cm)'
                                  // className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-lg focus:outline-none focus:border-[2px] border-[1px] w-1/2 ${
                                  //   !!form.formState.errors.height &&
                                  //   'border-red-500'
                                  // }`}
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
                          onClick={() =>
                            formFieldArrayForProductVariants.remove(index)
                          }
                        >
                          Xóa
                        </Button>
                      </div>
                    )
                  )}

                  <Button
                    type='button'
                    onClick={() =>
                      formFieldArrayForProductVariants.append({
                        sku: generateSKU(),
                        name: '',
                        discount: '',
                        price: '',
                        weight: '',
                        length: '',
                        width: '',
                        height: ''
                      })
                    }
                    className={clsx({
                      'mt-1': formFieldArrayForProductVariants.fields.length > 0
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
            name='shop_product_variants'
            render={() => (
              <FormItem>
                <div className='mb-2'>
                  <FormLabel>
                    Quản lý loại sản phẩm trong từng shop
                    <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormDescription>
                    Thêm các loại sản phẩm vào các shop với số lượng tương ứng
                  </FormDescription>
                </div>
                <div>
                  {formFieldArrayForShopProductVariants.fields.map(
                    (field, index) => (
                      <div
                        key={field.id}
                        className='mb-2 flex items-start gap-2'
                      >
                        <FormField
                          control={form.control}
                          name={`shop_product_variants.${index}.shop_id`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={String(field.value)}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Tên shop...' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {shops.map((shop, index) => (
                                    <SelectItem
                                      key={shop.id}
                                      value={String(shop.id)}
                                    >
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
                          name={`shop_product_variants.${index}.product_variant_sku`}
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
                                  {form
                                    .watch('product_variants')
                                    .map((type) => (
                                      <SelectItem
                                        key={type.sku}
                                        value={type.sku || 'Chưa có loại'}
                                      >
                                        {type.name || 'Chưa có loại'}
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
                          name={`shop_product_variants.${index}.stock_quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type='number'
                                  placeholder='Số lượng...'
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
                          onClick={() =>
                            formFieldArrayForShopProductVariants.remove(index)
                          }
                        >
                          Xóa
                        </Button>
                      </div>
                    )
                  )}

                  <Button
                    type='button'
                    onClick={() =>
                      formFieldArrayForShopProductVariants.append({
                        shop_id: 0,
                        product_variant_sku: '',
                        stock_quantity: 0
                      })
                    }
                    className={clsx({
                      'mt-1':
                        formFieldArrayForShopProductVariants.fields.length > 0
                    })}
                  >
                    Thêm
                  </Button>
                  <FormMessage className='mt-2' />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button type='submit' className='mt-10 w-full'>
            Tạo sản phẩm
          </Button>
        </div>
      </form>
    </Form>
  )
}
