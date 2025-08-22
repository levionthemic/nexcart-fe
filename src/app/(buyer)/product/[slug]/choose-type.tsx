'use client'

import { useEffect } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useVariantHandling } from '@/contexts/variant-handling-context'
import { Product } from '@/types/entities/product'

export default function Choosepv({ product }: { product: Product }) {
  const {
    productVariantId,
    setProductVariantId,
    productEndPrice,
    setProductEndPrice,
    discount,
    setDiscount
  } = useVariantHandling()

  useEffect(() => {
    if (productVariantId) {
      const pv = product?.product_variants.find(
        (pv) => pv.id === productVariantId
      )
      setProductEndPrice(Number(pv?.price))
      setDiscount(Number(pv?.discount))
    }
  }, [product, productVariantId])

  return (
    <>
      <div className='flex items-center gap-2 mt-2'>
        <div className='text-[#f90606] font-bold text-2xl tracking-wide'>
          {(productEndPrice * (1 - discount / 100)).toLocaleString()}
          <sup>đ</sup>
        </div>

        <div className='bg-[#ddd] dark:bg-muted/50 rounded-xl px-1 text-xs'>
          {`-${discount}%`}
        </div>

        <div className='text-sm text-gray-500 line-through'>
          {productEndPrice?.toLocaleString()}
          <sup>đ</sup>
        </div>
      </div>

      <div className='mt-10'>
        <div className='mb-2 font-medium text-mainColor1-600'>
          Loại sản phẩm
        </div>
        <fieldset className='space-y-4'>
          <RadioGroup
            className='gap-0 -space-y-px rounded-md shadow-xs'
            onValueChange={(value) => setProductVariantId(Number(value))}
          >
            {product.product_variants.map((pv) => (
              <div
                key={pv.id}
                className='border-input has-[button[data-state=checked]]:border-mainColor1-200 has-[button[data-state=checked]]:bg-mainColor1-100/20 relative flex flex-col gap-4 border px-4 py-3 outline-none first:rounded-t-md last:rounded-b-md has-[button[data-state=checked]]:z-10'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <RadioGroupItem
                      id={String(pv.id)}
                      value={String(pv.id)}
                      className='after:absolute after:inset-0'
                    />
                    <Label
                      className='inline-flex items-start'
                      htmlFor={String(pv.id)}
                    >
                      {pv.name}
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </fieldset>
      </div>
    </>
  )
}
