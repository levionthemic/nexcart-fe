'use client'

import { clsx } from 'clsx'
import { MdAddShoppingCart } from 'react-icons/md'
import { BsHandbag } from 'react-icons/bs'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

import { Button } from '../ui/button'
import { Label } from '../ui/label'
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
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { useEffect, useState } from 'react'
import { RiSubtractFill } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToCartAPI,
  fetchCurrentCartAPI,
  selectCurrentCart,
  setCart
} from '@/redux/cart/cartSlice'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { cloneDeep } from 'lodash'
import { ProductListItem } from '@/types/entities/product'
import { AppDispatch } from '@/redux/store'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Ratings } from '../ui/ratings'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

export interface ProductCardPropTypes {
  product: ProductListItem | null
  loading: boolean
  key?: number | string
}

export default function ProductCard({
  product,
  loading
}: ProductCardPropTypes) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectCurrentUser)
  const currentCart = useSelector(selectCurrentCart)

  const [productVariantId, setProductVariantId] = useState<number | undefined>()
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
        cartItems.push({
          product_variant: productVariant,
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
          product_variant_id: product!.id,
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
          quantity,
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
      setProductVariantId(undefined)
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
        'cursor-pointer border-gray-200 dark:border-border hover:border-[2px] border shadow-accent hover:shadow-xl transition-all ease-in-out hover:duration-300 overflow-hidden':
          !loading
      })}
    >
      <CardContent
        className='p-0 pb-2'
        onClick={() => router.push(`/product/${product?.id}`)}
      >
        {loading ? (
          <Skeleton className='w-full aspect-square' />
        ) : (
          <Image
            src={product?.thumbnail_url || DEFAULT_IMAGE_URL}
            height={300}
            width={300}
            alt=''
            className='object-cover w-full aspect-square'
          />
        )}
      </CardContent>

      <CardHeader
        className='px-4'
        onClick={() => router.push(`/product/${product?.id}`)}
      >
        {loading ? (
          <Skeleton className='h-[32px] w-full' />
        ) : (
          <CardTitle className='line-clamp-2 min-h-[32px] text-mainColor1-600 dark:text-mainColor1-800'>
            {product?.name}
          </CardTitle>
        )}

        {loading ? (
          <Skeleton className='h-[40px]' />
        ) : (
          <CardDescription>
            <div className='text-lg font-bold text-[#ff4d4f] mb-1 text-justify'>
              {averagePrice.toLocaleString()}
              <sup>đ</sup>
            </div>
            <div className='flex items-center justify-between my-2 text-sm text-gray-400'>
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

      {!loading && <Separator className='border-gray-200 dark:border-border' />}

      {loading ? (
        <Skeleton className='h-4 py-2 pl-4' />
      ) : (
        <Drawer onAnimationEnd={(open) => handleCloseDrawer(open)}>
          <DrawerTrigger asChild>
            <CardFooter className='grid grid-cols-2 p-0 text-sm text-center cursor-pointer'>
              <div
                className='flex items-center justify-center p-2 border-r dark:border-r-border hover:bg-mainColor2-800 text-mainColor2-800 hover:text-white border-r-gray-200'
                onClick={() => setIsAddToCart(true)}
              >
                <MdAddShoppingCart className='text-2xl' />
              </div>

              <div className='flex items-center justify-center p-2 hover:bg-mainColor1-800 text-mainColor1-800 hover:text-white'>
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
              <div className='flex items-center gap-10 mb-6'>
                <div className='overflow-hidden border border-gray-300 rounded-lg w-28 h-28'>
                  <Image
                    width={112}
                    height={112}
                    src={product?.thumbnail_url || DEFAULT_IMAGE_URL}
                    alt=''
                    className='object-contain w-full aspect-square'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <div>{product?.name}</div>
                  <div className='text-[#f90606] font-bold text-2xl'>
                    {(
                      product?.product_variants.find(
                        (pv) => pv.id === productVariantId
                      )?.price || averagePrice
                    )?.toLocaleString()}
                    <sup>đ</sup>
                  </div>
                  <div className='flex items-center gap-20'>
                    <div className='flex items-center justify-between p-1 border rounded-lg border-mainColor1-100'>
                      <RiSubtractFill
                        className='text-xl rounded-md cursor-pointer text-mainColor1-800 hover:bg-mainColor1-800/40'
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
                        className='w-[50px] text-center mx-1.5 border-none outline-none text-md font-semibold text-mainColor1-800'
                      />
                      <IoMdAdd
                        onClick={() =>
                          setQuantity(
                            Math.min(quantity + 1, totalStockQuantity)
                          )
                        }
                        className='text-xl rounded-md cursor-pointer text-mainColor1-800 hover:bg-mainColor2-800/40'
                      />
                    </div>

                    <div className='text-sm text-gray-500'>
                      Còn lại:{' '}
                      {totalStockQuantity || '(Chọn loại để hiện số lượng)'}
                    </div>
                  </div>
                </div>
              </div>

              <fieldset className='space-y-4'>
                <RadioGroup
                  className='gap-0 -space-y-px rounded-md shadow-xs'
                  onValueChange={() => setProductVariantId}
                >
                  {product?.product_variants?.map((productVariant) => (
                    <div
                      key={productVariant.id}
                      className='border-input has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border px-4 py-3 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <RadioGroupItem
                            id={String(productVariant.id)}
                            value={String(productVariant.id)}
                            className='after:absolute after:inset-0'
                          />
                          <Label
                            className='inline-flex items-start'
                            htmlFor={String(productVariant.id)}
                          >
                            {productVariant.name}
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </fieldset>
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
