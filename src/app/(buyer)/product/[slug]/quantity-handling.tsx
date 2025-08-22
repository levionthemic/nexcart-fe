'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  addToCartAPI,
  fetchCurrentCartAPI,
  selectCurrentCart,
  setCart
} from '@/redux/cart/cartSlice'
import { AppDispatch } from '@/redux/store'
import { Product } from '@/types/entities/product'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { IoBagCheckOutline } from 'react-icons/io5'
import { MdAddShoppingCart } from 'react-icons/md'
import { RiSubtractFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import ReviewRate from './_components/review-rate'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { toast } from 'sonner'
import { cloneDeep } from 'lodash'
import { useVariantHandling } from '@/contexts/variant-handling-context'
import { Ratings } from '@/components/ui/ratings'
import { useReview } from '@/contexts/review-context'

export default function QuantityHandling({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const { productVariantId, productEndPrice, discount } = useVariantHandling()

  const currentCart = useSelector(selectCurrentCart)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch<AppDispatch>()

  const router = useRouter()

  const { ratingAverage, setRatingAverage, totalReviews, reviews } = useReview()

  useEffect(() => {
    if (product.rating) setRatingAverage(product.rating)
  }, [])

  const calculateTotalStock = useMemo(() => {
    return product.product_variants
      .find((pv) => pv.id === productVariantId)
      ?.shop_product_variants.reduce(
        (sum, item) => sum + item.stock_quantity,
        0
      )
  }, [product, productVariantId])

  const handleAddToCart = () => {
    if (!productVariantId) {
      toast.error('Bạn chưa chọn loại sản phẩm!', { position: 'top-right' })
      return
    }

    // Have to handle use case cart of non-login users
    if (!currentUser) {
      const cart_items = cloneDeep(currentCart?.cart_items) || []

      let isExistedItem = false
      cart_items.forEach((item) => {
        if (!isExistedItem && item.product_variant.id === productVariantId) {
          item.quantity += quantity
          isExistedItem = true
        }
      })
      if (!isExistedItem) {
        const productVariant = product.product_variants.find(
          (pv) => pv.id === productVariantId
        )!
        cart_items.push({
          product_variant: productVariant,
          quantity
        })
      }

      const newCart = cloneDeep(currentCart)!
      newCart.cart_items = cart_items

      dispatch(setCart(newCart))
      toast.success('Thêm vào giỏ hàng thành công!')
      return
    }

    toast.promise(
      dispatch(
        addToCartAPI({
          cart_id: Number(currentCart?.id),
          product_variant_id: product.id,
          quantity
        })
      )
        .unwrap()
        .then(() => dispatch(fetchCurrentCartAPI())),
      {
        loading: 'Đang thêm vào giỏ hàng...',
        success: 'Thêm vào giỏ hàng thành công!'
      }
    )
  }

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error('Bạn phải đăng nhập để có thể thực hiện thanh toán!', {
        position: 'top-right'
      })
      return
    }

    if (!productVariantId) {
      toast.error('Bạn chưa chọn loại sản phẩm!', { position: 'top-right' })
      return
    }

    sessionStorage.setItem(
      'itemList',
      JSON.stringify([
        {
          product_variant_id: productVariantId,
          quantity: quantity,
          price_at_purchase: productEndPrice
        }
      ])
    )
    sessionStorage.setItem('buyNow', JSON.stringify(true))
    router.push('/checkout')
  }

  return (
    <div className='sticky left-0 top-36 h-fit'>
      <div className='p-4 mb-6 bg-white dark:bg-section rounded-lg'>
        <div className='mb-2 text-xl font-semibold text-mainColor1-600'>
          Tóm tắt
        </div>

        <div className='flex items-center justify-between mb-2 text-sm'>
          <span className='w-[35%] text-gray-500'>Tên hàng:</span>
          <span className='flex-1 text-right'>{product?.name}</span>
        </div>

        <div className='flex items-center justify-between text-sm'>
          <span className='text-gray-500'>Số lượng còn lại:</span>
          <span>{calculateTotalStock}</span>
        </div>

        <Separator className='my-4' />

        <div className='flex items-center gap-3'>
          <div className='font-semibold text-mainColor1-800'>Số lượng:</div>
          <div className='flex items-center justify-between p-1 border rounded-lg border-mainColor1-100'>
            <RiSubtractFill
              className='text-xl rounded-md cursor-pointer text-mainColor1-800 hover:bg-mainColor1-800/40'
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            />
            <input
              value={quantity}
              onChange={(e) => {
                setQuantity(parseInt(e.target.value))
              }}
              readOnly
              className='w-[50px] text-center mx-1.5 border-none outline-none text-md font-semibold text-mainColor1-800'
            />
            <IoMdAdd
              onClick={() =>
                setQuantity(
                  quantity < (calculateTotalStock || 1000)
                    ? quantity + 1
                    : calculateTotalStock || 1000
                )
              }
              className='text-xl rounded-md cursor-pointer text-mainColor1-800 hover:bg-mainColor2-800/40'
            />
          </div>
        </div>

        <div className='my-5'>
          <div className='mb-1 text-mainColor1-800/90'>Tạm tính</div>
          <div className='text-2xl font-bold tracking-normal text-gray-700 dark:text-foreground'>
            {(productEndPrice * (1 - discount / 100)).toLocaleString()}
            <sup>đ</sup>
          </div>
        </div>

        <div className='flex flex-col gap-2 mt-4 mb-2'>
          <Button
            className='w-full py-5 text-lg bg-mainColor1-800 hover:bg-mainColor1-600 hover:drop-shadow-xl'
            onClick={handleCheckout}
          >
            {' '}
            <IoBagCheckOutline /> Mua ngay
          </Button>
          <Button
            className='w-full bg-white border border-mainColor2-800 text-mainColor2-800 hover:bg-mainColor2-800/90 hover:text-white'
            onClick={handleAddToCart}
            variant='outline'
          >
            <MdAddShoppingCart />
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>

      <div className='p-4 mb-6 bg-white dark:bg-section rounded-lg'>
        <div className='mb-2 text-xl font-semibold text-mainColor1-600'>
          Đánh giá
        </div>
        <span className='font-semibold'>Tổng quan</span>

        <div className='my-3'>
          <div className='flex items-center gap-4 mt-3'>
            <span className='text-3xl font-semibold'>{ratingAverage || 0}</span>
            <Ratings rating={ratingAverage || 0} variant='yellow' size={35} />
          </div>
          <span className='text-sm text-gray-400'>{totalReviews} đánh giá</span>
        </div>

        <ReviewRate reviews={reviews} />
      </div>
    </div>
  )
}
