'use client'

import { clsx } from 'clsx'
import { cloneDeep } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BsHandbag } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io'
import { MdAddShoppingCart } from 'react-icons/md'
import { RiSubtractFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import ChooseProductVariant from '@/app/(buyer)/product/[slug]/choose-product-variant'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useVariantHandling } from '@/contexts/variant-handling-context'
import {
  addToCartAPI,
  fetchCurrentCartAPI,
  selectCurrentCart,
  setCart
} from '@/redux/cart/cartSlice'
import { AppDispatch } from '@/redux/store'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { CartProductVariant, ProductListItem } from '@/types/entities/product'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

import { Button } from '../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../ui/drawer'
import { Ratings } from '../ui/ratings'

export interface ProductCardPropTypes {
  product: ProductListItem | null
  loading: boolean
  key?: number | string
}

export default function ClientProductCard({
  product,
  loading
}: ProductCardPropTypes) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectCurrentUser)
  const currentCart = useSelector(selectCurrentCart)

  const { productVariantId } = useVariantHandling()
  const [quantity, setQuantity] = useState<number>(1)
  const [isAddToCart, setIsAddToCart] = useState(false)
  const [averagePrice, setAveragePrice] = useState(0)
  const [totalStockQuantity, setTotalStockQuantity] = useState(0)

  const handleAddToCart = () => {
    if (!productVariantId) {
      toast.error('Bạn chưa chọn loại sản phẩm!', { position: 'top-right' })
      return
    }

    if (!currentUser) {
      const cartItems = cloneDeep(currentCart?.cart_items) || []

      let isExistedItem = false
      cartItems.forEach((item) => {
        if (!isExistedItem && item.product_variant.id === productVariantId) {
          item.quantity += quantity
          isExistedItem = true
        }
      })
      if (!isExistedItem && product) {
        const productVariant = product.product_variants.find(
          (pv) => pv.id === productVariantId
        )!
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { category, brand, product_variants, ...restProduct } = product
        const cartProductVariant: CartProductVariant = {
          ...productVariant,
          product: restProduct
        }
        cartItems.push({
          product_variant: cartProductVariant,
          quantity
        })
      }

      const newCart = cloneDeep(currentCart)!
      newCart.cart_items = cartItems

      dispatch(setCart(newCart))
      toast.success('Thêm vào giỏ hàng thành công!')
      return
    }

    toast.promise(
      dispatch(
        addToCartAPI({
          cart_id: Number(currentCart?.id),
          product_variant_id: productVariantId,
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
      'order_items',
      JSON.stringify([
        {
          product_variant_id: productVariantId,
          quantity
        }
      ])
    )
    sessionStorage.setItem('buy_now', JSON.stringify(true))
    router.push('/checkout')
  }

  const handleChooseProductVariant = () => {
    if (isAddToCart) {
      handleAddToCart()
    } else {
      handleCheckout()
    }
  }

  const handleCloseDrawer = (open: boolean) => {
    if (!open) {
      setQuantity(1)
      setIsAddToCart(false)
    }
  }

  useEffect(() => {
    if (product) {
      setAveragePrice(
        Math.ceil(
          product.product_variants.reduce((sum, pv) => sum + pv.price, 0) /
            product.product_variants.length
        )
      )
    }
  }, [product])

  useEffect(() => {
    if (product && productVariantId) {
      setTotalStockQuantity(
        product.product_variants
          .find((pv) => pv.id === productVariantId)!
          .shop_product_variants.reduce(
            (sum, item) => sum + item.stock_quantity,
            0
          )
      )
    }
  }, [productVariantId, product])

  return (
    <Card
      className={clsx({
        'border-none shadow-none': loading,
        'dark:border-border shadow-accent cursor-pointer overflow-hidden border border-gray-200 transition-all ease-in-out hover:border-[2px] hover:shadow-xl hover:duration-300':
          !loading
      })}
    >
      <CardContent
        className='p-0 pb-2'
        onClick={() => router.push(`/product/${product?.slug}`)}
      >
        {loading ? (
          <Skeleton className='aspect-square w-full' />
        ) : (
          <Image
            src={product?.thumbnail_url || DEFAULT_IMAGE_URL}
            height={300}
            width={300}
            alt=''
            className='aspect-square w-full object-cover'
          />
        )}
      </CardContent>

      <CardHeader
        className='px-4'
        onClick={() => router.push(`/product/${product?.slug}`)}
      >
        {loading ? (
          <Skeleton className='h-[32px] w-full' />
        ) : (
          <CardTitle className='text-mainColor1-600 dark:text-mainColor1-800 line-clamp-2 min-h-8'>
            {product?.name}
          </CardTitle>
        )}

        {loading ? (
          <Skeleton className='h-[40px]' />
        ) : (
          <CardDescription>
            <div className='mb-1 text-justify text-lg font-bold text-[#ff4d4f]'>
              {averagePrice.toLocaleString()}
              <sup>đ</sup>
            </div>
            <div className='my-2 flex items-center justify-between text-sm text-gray-400'>
              <div className='flex items-center gap-2'>
                <span>{product?.rating || '0'}</span>
                <Ratings
                  rating={product?.rating || 0}
                  variant='yellow'
                  size={15}
                  // className='text-md leading-none'
                />
              </div>

              <span>| Đã bán: {product?.sold || 0}</span>
            </div>
          </CardDescription>
        )}
      </CardHeader>

      {!loading && <Separator className='dark:border-border border-gray-200' />}

      {loading ? (
        <Skeleton className='h-4 py-2 pl-4' />
      ) : (
        <Drawer onAnimationEnd={(open) => handleCloseDrawer(open)}>
          <DrawerTrigger asChild>
            <CardFooter className='grid cursor-pointer grid-cols-2 p-0 text-center text-sm'>
              <div
                className='dark:border-r-border hover:bg-mainColor2-800 text-mainColor2-800 flex items-center justify-center border-r border-r-gray-200 p-2 hover:text-white'
                onClick={() => setIsAddToCart(true)}
              >
                <MdAddShoppingCart className='text-2xl' />
              </div>

              <div className='hover:bg-mainColor1-800 text-mainColor1-800 flex items-center justify-center p-2 hover:text-white'>
                <BsHandbag className='text-2xl' />
              </div>
            </CardFooter>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Loại sản phẩm</DrawerTitle>
              <DrawerDescription>
                Chọn loại sản phẩm trước khi mua hoặc thêm vào giỏ hàng.
              </DrawerDescription>
            </DrawerHeader>

            <div className='p-4'>
              <div className='mb-6 flex items-center gap-10'>
                <div className='h-28 w-28 overflow-hidden rounded-lg border border-gray-300'>
                  <Image
                    width={112}
                    height={112}
                    src={product?.thumbnail_url || DEFAULT_IMAGE_URL}
                    alt=''
                    className='aspect-square w-full object-contain'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <div>{product?.name}</div>
                  <div className='text-2xl font-bold text-[#f90606]'>
                    {(
                      product?.product_variants.find(
                        (pv) => pv.id === productVariantId
                      )?.price || averagePrice
                    )?.toLocaleString()}
                    <sup>đ</sup>
                  </div>
                  <div className='flex items-center gap-20'>
                    <div className='border-mainColor1-100 flex items-center justify-between rounded-lg border p-1'>
                      <RiSubtractFill
                        className='text-mainColor1-800 hover:bg-mainColor1-800/40 cursor-pointer rounded-md text-xl'
                        onClick={() =>
                          setQuantity(quantity > 1 ? quantity - 1 : 1)
                        }
                      />
                      <input
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(parseInt(e.target.value))
                        }}
                        readOnly
                        className='text-md text-mainColor1-800 mx-1.5 w-[50px] border-none text-center font-semibold outline-none'
                      />
                      <IoMdAdd
                        onClick={() =>
                          setQuantity(
                            Math.min(quantity + 1, totalStockQuantity)
                          )
                        }
                        className='text-mainColor1-800 hover:bg-mainColor2-800/40 cursor-pointer rounded-md text-xl'
                      />
                    </div>

                    <div className='text-sm text-gray-500'>
                      Còn lại:{' '}
                      {totalStockQuantity || '(Chọn loại để hiện số lượng)'}
                    </div>
                  </div>
                </div>
              </div>

              {product && <ChooseProductVariant product={product} />}
            </div>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button onClick={handleChooseProductVariant}>Xác nhận</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </Card>
  )
}
