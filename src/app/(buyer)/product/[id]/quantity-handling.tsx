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
import { Product, ProductType } from '@/types/entities/product'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { IoBagCheckOutline } from 'react-icons/io5'
import { MdAddShoppingCart } from 'react-icons/md'
import { RiSubtractFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import ReviewRate from './_components/review-rate'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { toast } from 'sonner'
import { Cart, CartItem, FullProductItem } from '@/types/entities/cart'
import { cloneDeep } from 'lodash'
import { useVariantHandling } from '@/contexts/variant-handling-context'
import { Ratings } from '@/components/ui/ratings'

export default function QuantityHandling({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const { typeId, productEndPrice, discount } = useVariantHandling()

  const currentCart = useSelector(selectCurrentCart)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch<AppDispatch>()

  const router = useRouter()

  const handleAddToCart = () => {
    if (!typeId) {
      toast.error('Bạn chưa chọn loại sản phẩm!', { position: 'top-right' })
      return
    }
    const data = { productId: product._id, typeId, quantity } as CartItem
    if (!currentUser) {
      const itemList = cloneDeep(currentCart?.itemList) || []
      const fullProducts = cloneDeep(currentCart?.fullProducts) || []

      let isExistedItem = false
      itemList.forEach((item) => {
        if (
          !isExistedItem &&
          item.productId.toString() === data.productId &&
          item.typeId.toString() === data.typeId
        ) {
          item.quantity += quantity
          isExistedItem = true
        }
      })
      if (!isExistedItem) {
        itemList.push(data)
        const newProduct = cloneDeep(product) as FullProductItem
        newProduct.type = newProduct.types.find(
          (t) => t.typeId.toString() === data.typeId
        ) as ProductType
        newProduct.sellerId = newProduct.seller._id
        fullProducts.push(newProduct)
      }

      const newCart = { itemList, fullProducts } as Cart

      dispatch(setCart(newCart))
      toast.success('Thêm vào giỏ hàng thành công!')
      return
    }

    toast.promise(
      dispatch(addToCartAPI(data))
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

    if (!typeId) {
      toast.error('Bạn chưa chọn loại sản phẩm!', { position: 'top-right' })
      return
    }

    sessionStorage.setItem(
      'itemList',
      JSON.stringify([
        {
          productId: product._id,
          typeId,
          quantity: quantity,
          _weight: 0,
          _length: 0,
          _width: 0,
          _height: 0
        }
      ])
    )
    sessionStorage.setItem('buyNow', JSON.stringify(true))
    router.push('/checkout')
  }
  return (
    <div className='sticky left-0 top-36 h-fit'>
      <div className='p-4 mb-6 bg-white rounded-lg'>
        <div className='mb-2 text-xl font-semibold text-mainColor1-600'>
          Tóm tắt
        </div>

        <div className='flex items-center justify-between mb-2 text-sm'>
          <span className='w-[35%] text-gray-500'>Tên hàng:</span>
          <span className='flex-1 text-right'>{product?.name}</span>
        </div>

        <div className='flex items-center justify-between text-sm'>
          <span className='text-gray-500'>Số lượng còn lại:</span>
          <span>
            {product?.types.find((t) => t.typeId.toString() === typeId)
              ?.stock || 0}
          </span>
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
                  quantity < (product?.quantityInStock || 1000)
                    ? quantity + 1
                    : product?.quantityInStock || 1000
                )
              }
              className='text-xl rounded-md cursor-pointer text-mainColor1-800 hover:bg-mainColor2-800/40'
            />
          </div>
        </div>

        <div className='my-5'>
          <div className='mb-1 text-mainColor1-800/90'>Tạm tính</div>
          <div className='text-2xl font-bold tracking-normal text-gray-700'>
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
          >
            <MdAddShoppingCart />
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>

      <div className='p-4 mb-6 bg-white rounded-lg'>
        <div className='mb-2 text-xl font-semibold text-mainColor1-600'>
          Đánh giá
        </div>
        <span className='font-semibold'>Tổng quan</span>

        <div className='my-3'>
          <div className='flex items-center gap-4 mt-3'>
            <span className='text-3xl font-semibold'>
              {product?.rating || 0}
            </span>
            <Ratings rating={product?.rating || 0} variant='yellow' size={35} />
          </div>
          <span className='text-sm text-gray-400'>
            ({product.reviews.map((review) => review.comments).flat(1)?.length}{' '}
            đánh giá)
          </span>
        </div>

        <ReviewRate
          comments={product.reviews.map((review) => review.comments).flat(1)}
        />
      </div>
    </div>
  )
}
