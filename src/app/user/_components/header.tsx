'use client'

import { House } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BsHandbag } from 'react-icons/bs'
import { IoIosLogOut } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'

import LogoutComponent from '@/components/feedback/logout/logout'
import Notification from '@/components/feedback/notification/notification'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { selectCurrentCart } from '@/redux/cart/cartSlice'
import { fetchCurrentNotificationListAPI } from '@/redux/notification/notificationSlice'
import { AppDispatch } from '@/redux/store'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

export default function UserHeader() {
  const currentUser = useSelector(selectCurrentUser)
  const currentCart = useSelector(selectCurrentCart)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchCurrentNotificationListAPI())
  }, [dispatch])

  const router = useRouter()

  return (
    <div className='my-6 flex items-center justify-between'>
      <Link href='/'>
        <House className='text-mainColor1-800 cursor-pointer' />
      </Link>
      <div className='flex items-center justify-between gap-8'>
        <Notification />

        <Sheet key={'right'}>
          <SheetTrigger asChild>
            <div className='relative cursor-pointer transition-transform hover:scale-105 hover:duration-300 hover:ease-out'>
              <BsHandbag className='text-mainColor1-600 text-xl' />
              <Badge className='bg-mainColor1-400 absolute -top-3 -right-3 h-2 w-2 rounded-full p-2 text-center'>
                {currentCart?.cart_items?.length || 0}
              </Badge>
            </div>
          </SheetTrigger>
          <SheetContent side={'right'} className='space-y-2'>
            <SheetHeader className='my-1 pb-1'>
              <SheetTitle>
                Giỏ hàng của bạn{' '}
                <span className='text-sm text-gray-700'>
                  ({currentCart?.cart_items.length || 0})
                </span>
              </SheetTitle>
              <SheetDescription className='!m-0'>
                Sơ lược các sản phẩm trong giỏ hàng.
              </SheetDescription>
            </SheetHeader>
            <div className='max-h-[89%] overflow-auto p-4'>
              {currentCart?.cart_items?.map(
                ({ product_variant, quantity }, index) => (
                  <div key={index} className='my-6 flex items-center gap-2'>
                    <Image
                      src={product_variant?.image_url || DEFAULT_IMAGE_URL}
                      alt=''
                      width={40}
                      height={40}
                      className='size-10 rounded'
                    />
                    <div className='flex flex-col gap-1'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className='text-mainColor2-800 line-clamp-1 text-sm leading-none'>
                              {product_variant.product.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{product_variant.product.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className='mb-0.5 line-clamp-1 text-xs text-gray-400'>
                        Loại: {product_variant.name}
                      </p>
                      <div className='flex flex-col lg:flex-row lg:items-center lg:gap-4'>
                        <Badge className='bg-mainColor2-800/90'>
                          {quantity} sản phẩm
                        </Badge>
                        <span className='text-muted-foreground text-[0.8rem]'>
                          x {product_variant.price.toLocaleString('vi-VN')}
                          <sup>đ</sup>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  className='bg-mainColor2-800/90 hover:bg-mainColor2-800 w-full hover:drop-shadow-lg'
                  onClick={() => router.push('/cart')}
                >
                  Xem giỏ hàng
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <div className='flex items-center justify-between gap-2'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback>LV</AvatarFallback>
          </Avatar>
          <div className='text-mainColor1-800 text-sm'>
            Xin chào, <b>{currentUser?.buyer?.name || 'Ẩn danh'}</b>!
          </div>
        </div>

        <LogoutComponent
          icon={
            <IoIosLogOut className='text-mainColor1-800 right-3 cursor-pointer text-xl' />
          }
        />
      </div>
    </div>
  )
}
