'use client'

import { useEffect } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Product } from '@/types/entities/product'
import { Label } from '@/components/ui/label'
import { useVariantHandling } from '@/contexts/variant-handling-context'

export default function ChooseType({ product }: { product: Product }) {
  const {
    typeId,
    setTypeId,
    productEndPrice,
    setProductEndPrice,
    discount,
    setDiscount
  } = useVariantHandling()

  useEffect(() => {
    if (typeId) {
      const type = product?.types.find((type) => type.typeId === typeId)
      setProductEndPrice(type?.price as number)
      setDiscount(type?.discount as number)
    }
  }, [product?.types, typeId])

  return (
    <>
      <div className='flex items-center gap-2 mt-2'>
        <div className='text-[#f90606] font-bold text-2xl tracking-wide'>
          {(productEndPrice * (1 - discount / 100)).toLocaleString()}
          <sup>đ</sup>
        </div>

        <div className='bg-[#ddd] rounded-xl px-1 text-xs'>
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
            onValueChange={(value) => setTypeId(value)}
          >
            {product?.types?.map((type) => (
              <div
                key={type.typeId}
                className='border-input has-[button[data-state=checked]]:border-mainColor1-200 has-[button[data-state=checked]]:bg-mainColor1-100/20 relative flex flex-col gap-4 border px-4 py-3 outline-none first:rounded-t-md last:rounded-b-md has-[button[data-state=checked]]:z-10'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <RadioGroupItem
                      id={type.typeId}
                      value={type.typeId}
                      className='after:absolute after:inset-0'
                    />
                    <Label
                      className='inline-flex items-start'
                      htmlFor={type.typeId}
                    >
                      {type.typeName}
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
