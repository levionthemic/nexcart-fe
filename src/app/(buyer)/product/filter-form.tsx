'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Brand } from '@/types/entities/brand'
import { Category } from '@/types/entities/category'
import { DEFAULT_PAGE } from '@/utils/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaRegStar, FaStar } from 'react-icons/fa'
import Rating from 'react-rating'

interface FilterFormData {
  filterByRate: string
  filterByPrice: string
  filterByCategory: string
  filterByBrand: string
}

export interface SearchObjectType {
  page?: number
  keyword?: string
  rating?: string
  minPrice?: string
  maxPrice?: string
  categoryId?: string
  brandId?: string
}

interface ProductFilterFormPropTypes {
  categories: Category[]
  brands: Brand[]
}
export default function ProductFilterForm({
  categories,
  brands
}: ProductFilterFormPropTypes) {
  const [filterByRate, setFilterByRate] = useState<string>('')
  const [filterByPrice, setFilterByPrice] = useState<string>('')
  const [filterByCategory, setFilterByCategory] = useState<string>('')
  const [filterByBrand, setFilterByBrand] = useState<string>('')
  const form = useForm<FilterFormData>({
    defaultValues: {
      filterByRate: 'all',
      filterByPrice: 'all'
    }
  })

  const handleFilter: SubmitHandler<FilterFormData> = (data) => {
    setFilterByRate(data.filterByRate)
    setFilterByPrice(data.filterByPrice)
    setFilterByCategory(data.filterByCategory)
    setFilterByBrand(data.filterByBrand)
  }

  const getPriceRange = (rate: string) => {
    let minPrice = 0,
      maxPrice = 0
    switch (rate) {
      case '1':
        minPrice = 0
        maxPrice = 500000
        break
      case '500':
        minPrice = 500000
        maxPrice = 1000000
        break
      case '1000':
        minPrice = 1000000
        maxPrice = 5000000
        break
      case '5000':
        minPrice = 5000000
        maxPrice = 10000000
        break
      case '10000':
        minPrice = 10000000
        maxPrice = 1000000000
        break
      default:
        break
    }
    return { minPrice, maxPrice }
  }

  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || DEFAULT_PAGE
  const keyword = String(searchParams.get('keyword'))

  const router = useRouter()

  useEffect(() => {
    // const { sortKey, sortValue } = defineSort(sortOption)
    const searchObject: SearchObjectType = {
      keyword: keyword,
      page: page
    }

    if (filterByRate && filterByRate !== 'all') {
      searchObject['rating'] = filterByRate
    }
    if (filterByPrice && filterByPrice !== 'all') {
      const { minPrice, maxPrice } = getPriceRange(filterByPrice)
      searchObject['minPrice'] = String(minPrice)
      searchObject['maxPrice'] = String(maxPrice)
    }
    if (filterByCategory) {
      searchObject['categoryId'] = filterByCategory
    }
    if (filterByBrand) {
      searchObject['brandId'] = filterByBrand
    }

    const cleanedSearchObject: Record<string, string> = {}

    Object.entries(searchObject).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        cleanedSearchObject[key] = String(value)
      }
    })

    const searchPath = new URLSearchParams(cleanedSearchObject).toString()

    router.push(`?${searchPath}`)
  }, [filterByRate, filterByPrice, filterByCategory, filterByBrand])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFilter)} className='space-y-6'>
        <FormField
          control={form.control}
          name='filterByRate'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base'>Số sao đánh giá</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-col gap-2'
                >
                  <FormItem className='flex items-center px-4 space-x-3 space-y-0 rounded-md cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={'all'} className='bg-white' />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer'>
                      Tất cả
                    </FormLabel>
                  </FormItem>

                  <FormItem className='flex items-center px-4 space-x-3 space-y-0 rounded-md cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={'5'} className='bg-white' />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer flex items-center gap-1.5'>
                      <Rating
                        emptySymbol={<FaRegStar />}
                        fullSymbol={<FaStar />}
                        initialRating={5}
                        readonly
                        className='text-[#FBCA04] text-md leading-none'
                      />
                      <span>từ 5 sao</span>
                    </FormLabel>
                  </FormItem>

                  <FormItem className='flex items-center px-4 space-x-3 space-y-0 rounded-md cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={'4'} className='bg-white' />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer flex items-center gap-1.5'>
                      <Rating
                        emptySymbol={<FaRegStar />}
                        fullSymbol={<FaStar />}
                        initialRating={4}
                        readonly
                        className='text-[#FBCA04] text-md leading-none'
                      />
                      <span>từ 4 sao</span>
                    </FormLabel>
                  </FormItem>

                  <FormItem className='flex items-center px-4 space-x-3 space-y-0 rounded-md cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={'3'} className='bg-white' />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer flex items-center gap-1.5'>
                      <Rating
                        emptySymbol={<FaRegStar />}
                        fullSymbol={<FaStar />}
                        initialRating={3}
                        readonly
                        className='text-[#FBCA04] text-md leading-none'
                      />
                      <span>từ 3 sao</span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='filterByPrice'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base'>Khoảng giá</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-col gap-2'
                >
                  <FormItem className='flex items-center px-4 space-x-3 space-y-0 rounded-md cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={'all'} className='bg-white' />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer'>
                      Tất cả
                    </FormLabel>
                  </FormItem>

                  <FormItem className='flex items-center px-4 space-x-3 space-y-0 rounded-md cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={'1'} className='bg-white' />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer'>
                      {'< 500.000đ'}
                    </FormLabel>
                  </FormItem>

                  <FormItem className='flex items-center px-4 space-x-3 space-y-0 rounded-md cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={'500'} className='bg-white' />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer'>
                      500.000đ - 1.000.000đ
                    </FormLabel>
                  </FormItem>

                  <FormItem className='flex items-center px-4 space-x-3 space-y-0 rounded-md cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={'1000'} className='bg-white' />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer'>
                      1.000.000đ - 5.000.000đ
                    </FormLabel>
                  </FormItem>

                  <FormItem className='flex items-center px-4 space-x-3 space-y-0 rounded-md cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={'5000'} className='bg-white' />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer'>
                      5.000.000đ - 10.000.000đ
                    </FormLabel>
                  </FormItem>

                  <FormItem className='flex items-center px-4 space-x-3 space-y-0 rounded-md cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={'10000'} className='bg-white' />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer'>
                      {'> 10.000.000đ'}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='filterByCategory'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục sản phẩm</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn danh mục sản phẩm' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category: Category) => (
                    <SelectItem
                      key={category?._id}
                      value={String(category?._id)}
                    >
                      {category?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='filterByBrand'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thương hiệu</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn thương hiệu' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands?.map((brand) => (
                    <SelectItem key={brand?._id} value={brand?._id}>
                      {brand?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full bg-mainColor2-800'>
          Lọc
        </Button>
      </form>
    </Form>
  )
}
