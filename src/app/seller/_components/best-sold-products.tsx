/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { getSellerProductsApi } from '@/apis/product.api'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { ProductListItem } from '@/types/entities/product'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function BestSoldProducts() {
  const [bestSoldProducts, setBestSoldProducts] = useState<ProductListItem[]>(
    []
  )

  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    getSellerProductsApi(String(currentUser?.seller?.seller_id)).then((data) =>
      setBestSoldProducts(data?.data || [])
    )
  }, [])

  const calculateAveragePrice = (product: ProductListItem) => {
    return Math.ceil(
      product.product_variants.reduce((sum, item) => sum + item.price, 0) /
        product.product_variants.length
    )
  }

  return (
    <ul className='space-y-2'>
      {bestSoldProducts?.slice(0, 8)?.map((product) => (
        <li key={product?.id} className='flex items-center gap-4'>
          <div className='flex items-center gap-3 flex-1'>
            <Image
              src={product?.thumbnail_url || DEFAULT_IMAGE_URL}
              alt='Ảnh'
              width={40}
              height={40}
              className='rounded-lg object-cover min-w-10 size-10'
            />
            <div className='flex flex-col'>
              <span className='line-clamp-1'>{product?.name}</span>
              <span className='text-sm text-muted-foreground'>
                {calculateAveragePrice(product).toLocaleString('vi-vn')}
                <sup>đ</sup>
              </span>
            </div>
          </div>
          <div className='border rounded-lg py-1.5 px-2 text-sm font-semibold'>
            {product?.sold} lượt bán
          </div>
        </li>
      ))}
    </ul>
  )
}
