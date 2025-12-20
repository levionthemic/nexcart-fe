/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { ArrowRightIcon, LogInIcon, SearchIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { LuShoppingCart } from 'react-icons/lu'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { getProductsWithFiltersApi } from '@/apis/product.api'
import Notification from '@/components/feedback/notification/notification'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
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
import { useDebounceFn } from '@/hooks/use-debounce'
import {
  addToCartAPI,
  clearCart,
  fetchCurrentCartAPI,
  selectCurrentCart
} from '@/redux/cart/cartSlice'
import { fetchCurrentNotificationListAPI } from '@/redux/notification/notificationSlice'
import { AppDispatch } from '@/redux/store'
import { logoutUserAction, selectCurrentUser } from '@/redux/user/userSlice'
import { ProductListItem } from '@/types/entities/product'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

import MenuBar from './menu-bar'

export default function BuyerHeader() {
  const router = useRouter()

  const currentUser = useSelector(selectCurrentUser)
  const currentCart = useSelector(selectCurrentCart)
  const dispatch = useDispatch<AppDispatch>()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (currentUser) {
      if (currentCart && currentCart.id === 0) {
        Promise.all(
          currentCart?.cart_items?.map((item) =>
            dispatch(
              addToCartAPI({
                product_variant_id: item.product_variant.id,
                cart_id: currentCart.id,
                quantity: item.quantity
              })
            )
          )
        ).then(() => dispatch(fetchCurrentCartAPI()))
      } else {
        dispatch(fetchCurrentCartAPI())
      }
      dispatch(fetchCurrentNotificationListAPI())
    }
  }, [currentUser, dispatch])

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    const searchValue = inputRef?.current?.value
    if (searchValue) {
      router.push(`/product?keyword=${searchValue}`)
      handleBlur()
      window.scrollTo(0, 0)
    }
  }

  const handleLogout = async () => {
    dispatch(clearCart())
    toast.promise(dispatch(logoutUserAction()), {
      loading: 'Đang đăng xuất...',
      success: () => {
        return 'Đăng xuất thành công!'
      }
    })
  }

  const [open, setOpen] = useState(false)
  const [searchProducts, setSearchProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(false)

  const [showBackgroundOverlay, setShowBackgroundOverlay] = useState(false)

  const handleFocus = () => {
    setShowBackgroundOverlay(true)
    document.body.style.overflow = 'hidden'
  }

  const handleBlur = () => {
    inputRef?.current?.blur()
    setShowBackgroundOverlay(false)
    document.body.style.overflow = 'auto'
    setSearchProducts([])
  }

  const handleChange = useDebounceFn(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true)
      const keyword = event.target.value
      if (!keyword) {
        setSearchProducts([])
        setLoading(false)
        return
      }
      const searchPath = `?q[name]=${keyword}`
      getProductsWithFiltersApi(searchPath)
        .then((data) => {
          setSearchProducts(data?.products || [])
        })
        .finally(() => {
          setLoading(false)
        })
    },
    1000
  )

  const handleMoveToCart = () => {
    router.push('/cart')
  }

  return (
    <>
      <div className='bg-background fixed top-0 left-0 z-50 w-full'>
        <div className='container mx-auto'>
          <div className='flex items-center justify-between'>
            <div
              className='text-mainColor1-600 cursor-pointer text-4xl font-medium transition-transform hover:scale-105 hover:duration-500'
              onClick={() => router.push('/')}
            >
              <Image
                src='/mainlogo.png'
                alt='NexCart Logo'
                width={80}
                height={80}
                className='aspect-video w-32 object-cover'
              />
            </div>
            <div className='flex-1'>
              <form
                onSubmit={handleSearch}
                className='relative mx-auto w-[80%]'
              >
                <Input
                  className='peer placeholder:text-mainColor1-100 border-mainColor1-800 text-mainColor1-600 w-full flex-1 rounded-full ps-9 pe-9 placeholder:text-sm hover:border-[2px] focus:border-[2px]'
                  placeholder='Bạn cần tìm gì?'
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={(event) => handleChange(event)}
                  ref={inputRef}
                />
                <div className='text-mainColor1-600/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                  <SearchIcon size={16} />
                </div>
                <button
                  className='text-mainColor1-600/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                  aria-label='Submit search'
                  type='submit'
                >
                  <ArrowRightIcon size={16} aria-hidden='true' />
                </button>
              </form>
            </div>

            <div className='flex items-center gap-10'>
              <Notification />

              <Sheet key={'right'}>
                <SheetTrigger asChild>
                  <div className='relative cursor-pointer transition-transform hover:scale-105 hover:duration-300 hover:ease-out'>
                    <LuShoppingCart className='text-mainColor1-600 text-xl' />
                    <Badge className='bg-mainColor1-600 absolute -top-3 -right-3 h-2 w-2 rounded-full p-2 text-center'>
                      {currentCart?.cart_items?.length || 0}
                    </Badge>
                  </div>
                </SheetTrigger>
                <SheetContent side={'right'}>
                  <SheetHeader className='my-2'>
                    <SheetTitle>
                      Giỏ hàng của bạn{' '}
                      <span className='text-sm text-gray-700'>
                        ({currentCart?.cart_items?.length || 0})
                      </span>
                    </SheetTitle>
                    <SheetDescription className='!m-0'>
                      Sơ lược các sản phẩm trong giỏ hàng.
                    </SheetDescription>
                  </SheetHeader>
                  <div className='max-h-[89%] space-y-6 overflow-auto p-4'>
                    {currentCart?.cart_items?.map(
                      ({ product_variant, quantity }, index) => (
                        <div key={index} className='flex items-center gap-2'>
                          <Image
                            src={product_variant.image_url || DEFAULT_IMAGE_URL}
                            alt=''
                            width={40}
                            height={40}
                            className='size-10 rounded-md'
                          />
                          <div className='flex flex-col gap-1'>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className='text-mainColor2-800 line-clamp-1 text-sm leading-none'>
                                    {product_variant.name}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{product_variant.name}</p>
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
                                x{' '}
                                {product_variant.price.toLocaleString('vi-VN')}
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
                        onClick={handleMoveToCart}
                      >
                        Xem giỏ hàng
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {currentUser ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger asChild>
                    <div className='flex cursor-pointer items-center gap-3'>
                      <Avatar>
                        <AvatarImage src={currentUser?.avatar} />
                        <AvatarFallback>LV</AvatarFallback>
                      </Avatar>
                      <div className='text-sm text-gray-500'>
                        Xin chào, <br></br>
                        <b className='text-accent-foreground'>
                          {currentUser?.buyer?.name || 'Ẩn danh'}
                        </b>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-40'>
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => router.push('/user/profile')}
                        className='cursor-pointer'
                      >
                        Hồ sơ
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push('/user/orders')}
                        className='cursor-pointer'
                      >
                        Đơn hàng
                      </DropdownMenuItem>
                      <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className='cursor-pointer font-medium text-red-600 hover:bg-red-100 hover:text-red-600'
                          onSelect={(event) => {
                            event.preventDefault()
                          }}
                        >
                          Đăng xuất
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Bạn có chắc chắn muốn đăng xuất?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn sẽ cần phải đăng nhập lại trước khi truy cập vào
                            hệ thống.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setOpen(false)}>
                            Hủy
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleLogout}>
                            Đăng xuất
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div
                  className='text-mainColor1-600 flex cursor-pointer items-center gap-2 transition-transform hover:scale-105 hover:duration-300 hover:ease-out'
                  onClick={() => router.push('/login')}
                >
                  <LogInIcon />
                  Đăng nhập
                </div>
              )}
            </div>
          </div>
        </div>
        <MenuBar />
      </div>
      {showBackgroundOverlay && (
        <>
          <div className='fixed top-20 z-50 h-[100vh] w-[100vw] bg-black opacity-80'></div>
          <div
            className='fixed top-16 left-[18%] z-[51] h-fit w-[53%] rounded-sm bg-white p-1 text-center text-sm opacity-100 shadow-xl'
            style={{
              boxShadow: 'rgba(0, 0, 0, 0.28) 0px 6px 12px 0px'
            }}
          >
            {loading && 'Đang tìm kiếm...'}
            {!loading && searchProducts.length
              ? searchProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className='my-1 flex cursor-pointer items-center gap-4 rounded-sm px-1 py-2 hover:bg-gray-100'
                    onMouseDown={() => {
                      router.push(`/product/${prod.id}`)
                    }}
                  >
                    <div>
                      <Image
                        src={prod?.thumbnail_url || DEFAULT_IMAGE_URL}
                        alt=''
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <span className='text-sm'>{prod?.name}</span>
                    </div>
                  </div>
                ))
              : 'Không có kết quả.'}
          </div>
        </>
      )}
    </>
  )
}
