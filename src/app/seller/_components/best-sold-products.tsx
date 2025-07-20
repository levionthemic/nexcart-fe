'use client'

import { getProductsApi } from '@/apis/product.api'
import { ProductListItem } from '@/types/entities/product'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export default function BestSoldProducts() {
  const [bestSoldProducts, setBestSoldProducts] = useState<ProductListItem[]>([])

  useEffect(() => {
    getProductsApi().then(data => setBestSoldProducts(data?.data || []))
  }, [])

  return (
    <ul className='space-y-2'>
      {bestSoldProducts?.slice(0, 8)?.map((product) => (
        <li key={product?.id} className='flex items-center gap-4'>
          <div className='flex items-center gap-3 flex-1'>
            <Image
              src={product?.avatar || DEFAULT_IMAGE_URL}
              alt='Ảnh'
              width={40}
              height={40}
              className='rounded-lg object-cover min-w-10'
            />
            <div className='flex flex-col'>
              <span className='line-clamp-1'>{product?.name}</span>
              <span className='text-sm text-muted-foreground'>
                {product?.averagePrice.toLocaleString('vi-vn')}
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
