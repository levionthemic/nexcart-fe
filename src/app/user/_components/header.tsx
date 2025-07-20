'use client'

import { CiSearch } from 'react-icons/ci'
import { CiBellOn } from 'react-icons/ci'
import { BsHandbag } from 'react-icons/bs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { House } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { selectCurrentCart } from '@/redux/cart/cartSlice'
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
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

export default function UserHeader() {
  const currentUser = useSelector(selectCurrentUser)
  const currentCart = useSelector(selectCurrentCart)
  const router = useRouter()

  return (
    <div className='flex items-center justify-between my-10'>
      <Link href='/'>
        <House className='cursor-pointer text-mainColor1-800' />
      </Link>
      <CiSearch className='text-2xl font-bold cursor-pointer text-mainColor1-800' />
      <div className='flex items-center justify-between gap-8'>
        <CiBellOn className='text-2xl font-bold cursor-pointer text-mainColor1-800' />

        <Sheet key={'right'}>
          <SheetTrigger asChild>
            <div className='relative transition-transform cursor-pointer hover:scale-105 hover:ease-out hover:duration-300'>
              <BsHandbag className='text-xl text-mainColor1-600' />
              <Badge className='absolute w-2 h-2 p-2 text-center rounded-full -top-3 -right-3 bg-mainColor1-400'>
                {currentCart?.cartItems?.length || 0}
              </Badge>
            </div>
          </SheetTrigger>
          <SheetContent side={'right'} className='space-y-2'>
            <SheetHeader className='my-1 pb-1'>
              <SheetTitle>
                Giỏ hàng của bạn{' '}
                <span className='text-sm text-gray-700'>
                  ({currentCart?.cartItems.length || 0})
                </span>
              </SheetTitle>
              <SheetDescription className='!m-0'>
                Sơ lược các sản phẩm trong giỏ hàng.
              </SheetDescription>
            </SheetHeader>
            <div className='p-4 max-h-[89%] overflow-auto'>
              {currentCart?.cartItems?.map(({ product, quantity }, index) => (
                <div key={index} className='flex items-center gap-2 my-6'>
                  <Image
                    src={product?.avatar || DEFAULT_IMAGE_URL}
                    alt=''
                    width={40}
                    height={40}
                    className='size-10 rounded'
                  />
                  <div className='flex flex-col gap-1'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='text-sm leading-none line-clamp-1 text-mainColor2-800'>
                            {product?.name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{product?.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className='line-clamp-1 text-xs text-gray-400 mb-0.5'>
                      Loại: {product?.type?.name}
                    </p>
                    <div className='flex flex-col lg:flex-row lg:items-center lg:gap-4'>
                      <Badge className='bg-mainColor2-800/90'>
                        {quantity} sản phẩm
                      </Badge>
                      <span className='text-[0.8rem] text-muted-foreground'>
                        x {product?.type?.price.toLocaleString('vi-VN')}
                        <sup>đ</sup>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  className='w-full bg-mainColor2-800/90 hover:bg-mainColor2-800 hover:drop-shadow-lg'
                  onClick={() => router.push('/cart')}
                >
                  Xem giỏ hàng
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <div className='flex items-center justify-between gap-2'>
          <Avatar className='w-8 h-8'>
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback>LV</AvatarFallback>
          </Avatar>
          <div className='text-sm text-mainColor1-800'>
            Xin chào, <b>{currentUser?.username}</b>!
          </div>
        </div>
      </div>
    </div>
  )
}
