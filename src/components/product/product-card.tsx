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
import { useState } from 'react'
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
import { Product, ProductType } from '@/types/entities/product'
import { AppDispatch } from '@/redux/store'
import { Cart, CartItem, FullProductItem } from '@/types/entities/cart'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Ratings } from '../ui/ratings'

export interface ProductCardPropTypes {
  product?: Product
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

  const [typeId, setTypeId] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [isAddToCart, setIsAddToCart] = useState(false)

  const handleAddToCart = () => {
    if (!typeId) {
      toast.error('Bạn chưa chọn loại sản phẩm!', { position: 'top-right' })
      return
    }
    const data = { productId: product?._id, typeId, quantity } as CartItem

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
        const newProduct: FullProductItem = cloneDeep(product) as Product
        newProduct.type = newProduct.types.find(
          (t) => t.typeId.toString() === data.typeId
        ) as ProductType
        newProduct.sellerId = newProduct.seller._id
        fullProducts.push(newProduct)
      }

      const newCart = { itemList, fullProducts } as Cart

      dispatch(setCart(newCart))
      setIsAddToCart(false)
      toast.success('Thêm vào giỏ hàng thành công!')
      return
    }

    toast.promise(
      dispatch(addToCartAPI(data))
        .unwrap()
        .then(() => {
          dispatch(fetchCurrentCartAPI())
          setIsAddToCart(false)
        }),
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
          productId: String(product?._id),
          typeId,
          quantity,
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

  const handleChooseType = () => {
    if (isAddToCart) {
      handleAddToCart()
    } else {
      handleCheckout()
    }
  }

  const handleCloseDrawer = (open: boolean) => {
    if (!open) {
      setTypeId('')
      setQuantity(1)
      setIsAddToCart(false)
    }
  }

  return (
    <Card
      className={clsx({
        'border-none shadow-none': loading,
        'cursor-pointer border-gray-200 hover:border-[2px] border shadow hover:shadow-xl overflow-hidden':
          !loading
      })}
    >
      <CardContent
        className='p-2'
        onClick={() => router.push(`/product/${product?._id}`)}
      >
        {loading ? (
          <Skeleton className='w-full aspect-square' />
        ) : (
          <Image
            height={300}
            width={300}
            src={String(product?.avatar)}
            alt=''
            className='object-contain w-full aspect-square'
          />
        )}
      </CardContent>

      <CardHeader
        className='px-4'
        onClick={() => router.push(`/product/${product?._id}`)}
      >
        {loading ? (
          <Skeleton className='h-[32px]' />
        ) : (
          <CardTitle className='line-clamp-2 min-h-[32px] text-mainColor1-600'>
            {product?.name}
          </CardTitle>
        )}

        {loading ? (
          <Skeleton className='h-[40px]' />
        ) : (
          <CardDescription>
            <div className='text-lg font-bold text-[#ff4d4f] mb-1 text-justify'>
              {product?.avgPrice.toLocaleString()}
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

      {!loading && <Separator className='border-gray-200' />}

      {loading ? (
        <Skeleton className='h-4 py-2 pl-4' />
      ) : (
        <Drawer onAnimationEnd={(open) => handleCloseDrawer(open)}>
          <DrawerTrigger asChild>
            <CardFooter className='grid grid-cols-2 p-0 text-sm text-center cursor-pointer'>
              <div
                className='flex items-center justify-center p-2 border-r hover:bg-mainColor2-800 text-mainColor2-800 hover:text-white border-r-gray-200'
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
                    src={String(product?.avatar)}
                    alt=''
                    className='object-contain w-full aspect-square'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <div>{product?.name}</div>
                  <div className='text-[#f90606] font-bold text-2xl'>
                    {(
                      product?.types.find((t) => t.typeId.toString() === typeId)
                        ?.price || product?.avgPrice
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
                            quantity <
                              (product?.types.find(
                                (t) => t.typeId.toString() === typeId
                              )?.stock || 1000)
                              ? quantity + 1
                              : product?.types.find(
                                  (t) => t.typeId.toString() === typeId
                                )?.stock || 1000
                          )
                        }
                        className='text-xl rounded-md cursor-pointer text-mainColor1-800 hover:bg-mainColor2-800/40'
                      />
                    </div>

                    <div className='text-sm text-gray-500'>
                      Còn lại:{' '}
                      {product?.types.find(
                        (t) => t.typeId.toString() === typeId
                      )?.stock || '(Chọn loại để hiện số lượng)'}
                    </div>
                  </div>
                </div>
              </div>

              <fieldset className='space-y-4'>
                <RadioGroup
                  className='gap-0 -space-y-px rounded-md shadow-xs'
                  onValueChange={setTypeId}
                >
                  {product?.types?.map((type) => (
                    <div
                      key={type.typeId}
                      className='border-input has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border px-4 py-3 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10'
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

            <DrawerFooter>
              <DrawerClose asChild>
                <Button onClick={handleChooseType}>Xác nhận</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </Card>
  )
}
