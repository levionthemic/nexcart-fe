/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useRef, useState } from 'react'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useVariantHandling } from '@/contexts/variant-handling-context'
import { Product, ProductListItem } from '@/types/entities/product'

export default function ChooseProductVariant({
  product
}: {
  product: Product | ProductListItem
}) {
  const {
    productVariantId,
    setProductVariantId,
    productEndPrice,
    setProductEndPrice,
    discount,
    setDiscount
  } = useVariantHandling()

  const mapOptionWithOptionValue = useRef<Map<number, Set<number>>>(new Map())
  const mapProductVariantWithOptionAndOptionValue = useRef<
    Map<number, number[][]>
  >(new Map())
  const mapIdOption = useRef<Map<number, string>>(new Map())
  const mapIdOptionValue = useRef<Map<number, string>>(new Map())
  const chosenOptionsMap = useRef<Map<number, number>>(new Map())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useState(0)

  useEffect(() => {
    if (product) {
      product.product_variants.forEach((pv) => {
        const options: number[][] = []
        pv.product_variant_option_values.forEach((pvov) => {
          const optionValue = pvov.option_value
          const { id, name } = optionValue.option

          mapIdOption.current.set(id, name)
          mapIdOptionValue.current.set(optionValue.id, optionValue.value)

          const arr = mapOptionWithOptionValue.current.get(id) ?? new Set()
          arr.add(optionValue.id)
          mapOptionWithOptionValue.current.set(id, arr)
          options.push([id, optionValue.id])
        })
        mapProductVariantWithOptionAndOptionValue.current.set(pv.id, options)
      })
      chosenOptionsMap.current = new Map(
        [...mapOptionWithOptionValue.current].map(([key, value]) => [
          key,
          [...value][0]
        ])
      )
      mapProductVariantWithOptionAndOptionValue.current.forEach(
        (value, key) => {
          if (deepEqual2D(value, [...chosenOptionsMap.current])) {
            setProductVariantId(key)
            return
          }
        }
      )
      forceUpdate((x) => x + 1)
    }
  }, [product])

  useEffect(() => {
    if (productVariantId) {
      const pv = product?.product_variants.find(
        (pv) => pv.id === productVariantId
      )
      setProductEndPrice(Number(pv?.price))
      setDiscount(Number(pv?.discount))
    }
  }, [product, productVariantId])

  const deepEqual2D = (arr1: number[][], arr2: number[][]) => {
    if (arr1.length !== arr2.length) return false

    for (let i = 0; i < arr1.length; i++) {
      const row1 = arr1[i]
      const row2 = arr2[i]

      if (row1.length !== row2.length) return false

      for (let j = 0; j < row1.length; j++) {
        if (row1[j] !== row2[j]) return false
      }
    }
    return true
  }

  const handleChooseOptions = (key: number, value: number) => {
    chosenOptionsMap.current.set(key, value)
    mapProductVariantWithOptionAndOptionValue.current.forEach((value, key) => {
      if (deepEqual2D(value, [...chosenOptionsMap.current])) {
        setProductVariantId(key)
        return
      }
    })
  }

  return (
    <>
      <div className='mt-2 flex items-center gap-2'>
        <div className='text-2xl font-bold tracking-wide text-[#f90606]'>
          {(productEndPrice * (1 - discount / 100)).toLocaleString()}
          <sup>đ</sup>
        </div>

        <div className='dark:bg-muted/50 rounded-xl bg-[#ddd] px-1 text-xs'>
          {`-${discount}%`}
        </div>

        <div className='text-sm text-gray-500 line-through'>
          {productEndPrice?.toLocaleString()}
          <sup>đ</sup>
        </div>
      </div>

      <div className='mt-6 space-y-6'>
        {Array.from(mapOptionWithOptionValue.current).map(([key, value]) => (
          <fieldset className='space-y-4' key={key}>
            <legend className='text-md text-mainColor1-600 leading-none font-medium'>
              {mapIdOption.current.get(key)}
            </legend>
            <RadioGroup
              className='grid grid-cols-3 gap-2'
              defaultValue={Array.from(value)[0].toString()}
              onValueChange={(value) => handleChooseOptions(key, Number(value))}
            >
              {Array.from(value).map((item) => (
                <label
                  key={item}
                  className='border-input has-data-[state=checked]:border-primary/80 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:border-2'
                >
                  <RadioGroupItem
                    id={String(item)}
                    value={String(item)}
                    className='sr-only after:absolute after:inset-0'
                  />
                  <p className='text-foreground text-sm leading-none font-medium'>
                    {mapIdOptionValue.current.get(item)}
                  </p>
                </label>
              ))}
            </RadioGroup>
          </fieldset>
        ))}
      </div>
    </>
  )
}
