import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Rating from 'react-rating'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IoMdAdd, IoMdStar, IoMdStarOutline } from 'react-icons/io'
import { RiSubtractFill } from 'react-icons/ri'

import {
  addCommentAPI,
  getProductDetailsAPI,
  getProductsAPI
} from '@/apis/buyerApis'
import { selectCurrentUser } from '@/redux/user/userSlice'
import Loader from '@/components/loader/loader'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  FaRegCommentDots,
  FaRegStar,
  FaRegThumbsUp,
  FaStar
} from 'react-icons/fa'
import { IoBagCheckOutline, IoShareSocialOutline } from 'react-icons/io5'
import { COMMENTS, DEFAULT_ITEMS_PER_PAGE } from '@/utils/constants'
import ProductCard from '@/components/product/product-card'
import {
  addToCartAPI,
  fetchCurrentCartAPI,
  selectCurrentCart,
  setCart
} from '@/redux/cart/cartSlice'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { MdAddShoppingCart } from 'react-icons/md'
import { getAddressString } from '@/utils/helpers'
import { socketIoInstance } from '@/socket'
import { cloneDeep } from 'lodash'
import PaginationComponent from '@/components/pagination/pagination'
import { useLoading } from '@/contexts/LoadingContext'
import { AppDispatch } from '@/redux/store'
import { Product, ProductType } from '@/types/entities/product'
import { Cart, CartItem, FullProductItem } from '@/types/entities/cart'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Address } from '@/types/entities/address'
import ReviewRate from './_components/review-rate'
import ReviewModal from './_components/review-modal'

export default function ProductDetail() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')

  const [product, setProduct] = useState<Product | null>(null)
  const [discount, setDiscount] = useState<number>(0)
  const [quantity, setQuantity] = useState(1)
  const [typeId, setTypeId] = useState<string>('')
  const [productEndPrice, setProductEndPrice] = useState<number>(0)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])

  const { startLoading, endLoading } = useLoading()

  useEffect(() => {
    startLoading()
    getProductsAPI()
      .then((data) => {
        const recommendedProducts = data.products
        setRecommendedProducts(recommendedProducts)
      })
      .finally(() => endLoading())
  }, [])

  useEffect(() => {
    if (typeId) {
      const type = product?.types.find((type) => type.typeId === typeId)
      setProductEndPrice(type?.price as number)
      setDiscount(type?.discount as number)
    }
  }, [product?.types, typeId])

  const currentUser = useSelector(selectCurrentUser)
  const currentCart = useSelector(selectCurrentCart)

  const [address, setAddress] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)

    socketIoInstance.emit('FE_JOIN_PRODUCT', productId)

    socketIoInstance.on(
      'BE_UPDATE_TYPING',
      ({ productId: id, users }: { productId: string; users: string[] }) => {
        if (id === productId)
          setTypingUsers(users.filter((id: string) => id !== currentUser?._id))
      }
    )

    socketIoInstance.on('BE_NEW_REVIEW', (data) => {
      setProduct((prevProduct) => {
        const newProduct = cloneDeep(prevProduct) as Product
        newProduct.reviews = data.reviewList
        newProduct.rating = data.updatedProduct.rating
        return newProduct
      })
    })

    startLoading()
    getProductDetailsAPI(String(productId))
      .then((data) => {
        setProduct(data)
        setProductEndPrice(data?.avgPrice)
      })
      .finally(() => endLoading())

    return () => {
      socketIoInstance.emit('FE_LEAVE_PRODUCT', productId)
      socketIoInstance.off('BE_UPDATE_TYPING')
    }
  }, [productId])

  useEffect(() => {
    startLoading()
    getAddressString(currentUser?.buyerAddress?.[0] as Address)
      .then((result) => setAddress(result))
      .finally(() => endLoading())
  }, [currentUser?.buyerAddress])

  const handleAddToCart = () => {
    if (!typeId) {
      toast.error('Bạn chưa chọn loại sản phẩm!', { position: 'top-right' })
      return
    }
    const data = { productId, typeId, quantity } as CartItem
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

    router.push('/buyer/checkout', {
      state: {
        selectedRows: [
          {
            ...product,
            type: product?.types.find((t) => t.typeId.toString() === typeId),
            quantity: quantity
          }
        ],
        buyNow: true
      }
    })
  }

  const onSubmitReview = (data: { rating: number; content: string }) => {
    const reviewData = {
      productId: product?._id,
      ...data,
      medias: []
    }

    toast.promise(addCommentAPI(reviewData), {
      loading: 'Đang gửi đánh giá...',
      success: (res) => {
        if (!res.error) {
          return 'Đánh giá thành công!'
        }
        throw res
      }
    })
  }
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const updateStartTyping = () => {
    if (!isTyping) {
      socketIoInstance.emit('FE_START_TYPING', {
        productId,
        userId: currentUser?._id
      })
      setIsTyping(true)
    }
  }

  const updateStopTyping = () => {
    socketIoInstance.emit('FE_STOP_TYPING', {
      productId,
      userId: currentUser?._id
    })
    setIsTyping(false)
  }

  const [page, setPage] = useState(1)
  const sectionRef = useRef<HTMLDivElement>(null)

  const handlePaginate = (page: number) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => {
      window.scrollBy({ top: -120, behavior: 'smooth' })
    }, 500)
    setPage(page)
  }

  if (!product) {
    return <Loader caption={'Đang tải...'} />
  }

  return (
    <div className='bg-[#F5F5FA] py-4'>
      <div className='container mx-auto'>
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/buyer'>Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='#'>Sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='relative grid grid-cols-4 gap-6'>
          <div className='col-span-3'>
            <div className='relative grid grid-cols-3 gap-6 mb-6 h-fit'>
              <div className='sticky left-0 flex items-center justify-center p-4 pb-32 bg-white rounded-lg h-fit top-36'>
                <div className='overflow-hidden border rounded-2xl'>
                  <Image
                    src={product?.avatar}
                    alt={product?.name}
                    className='h-[350px] w-[350px] scale-105 object-cover'
                  />
                </div>
              </div>

              <div className='col-span-2'>
                <div className='p-4 mb-6 bg-white rounded-lg'>
                  <span className='inline-flex items-center px-2 py-1 mb-2 text-xs font-medium text-green-700 rounded-md bg-green-50 ring-1 ring-green-600/20 ring-inset'>
                    Còn hàng!
                  </span>
                  <div className='text-2xl font-bold text-mainColor1-600'>
                    {product?.name}
                  </div>

                  <div className='flex items-center gap-2 mt-2 text-sm'>
                    <span>{product?.rating || 0}</span>
                    <Rating
                      emptySymbol={<IoMdStarOutline />}
                      fullSymbol={<IoMdStar />}
                      initialRating={product?.rating || 0}
                      readonly
                      className='text-[#FBCA04] text-xl leading-none'
                    />
                    <div
                      style={{ border: '1px solid #ddd', height: '20px' }}
                    ></div>
                    <div>Đã bán: {product?.sold || '0'}</div>
                  </div>

                  <div className='flex items-center gap-2 mt-2'>
                    <div className='text-[#f90606] font-bold text-2xl tracking-wide'>
                      {(
                        productEndPrice *
                        (1 - discount / 100)
                      ).toLocaleString()}
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
                </div>

                <div className='p-4 mb-6 bg-white rounded-lg'>
                  <div className='mb-1 text-lg font-semibold text-mainColor1-600'>
                    Thông tin vận chuyển
                  </div>
                  <p className='text-sm'>Giao đến: {address}</p>
                  <div className='w-full h-px my-2 border border-t-0 border-gray-200 divider'></div>
                  <div>GHTK</div>
                </div>

                <div className='p-4 mb-6 bg-white rounded-lg'>
                  <div className='mb-3 text-lg font-semibold text-mainColor1-600'>
                    Thông tin chi tiết
                  </div>
                  {product?.features?.map((feature, index) => (
                    <div key={index} className='mx-4'>
                      <div className='flex items-center justify-between my-1.5'>
                        <span className='text-sm text-gray-400'>
                          {feature.field}
                        </span>
                        <span className=''>{feature.content}</span>
                      </div>
                      {index != product?.features?.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>

                <div className='p-4 bg-white rounded-lg'>
                  <div className='mb-2 text-lg font-semibold text-mainColor1-800'>
                    Mô tả sản phẩm
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: product?.description }}
                    style={{ textAlign: 'justify' }}
                  />
                </div>
              </div>
            </div>

            <div className=''>
              <div
                className='relative p-4 mb-6 bg-white rounded-lg h-fit'
                ref={sectionRef}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-xl font-semibold text-mainColor2-800'>
                      Bình luận sản phẩm
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      Bạn có thể xem các đánh giá từ các khách hàng khác.
                    </p>
                  </div>
                  <ReviewModal
                    // product={product}
                    onSubmitReview={onSubmitReview}
                    updateStopTyping={updateStopTyping}
                    updateStartTyping={updateStartTyping}
                  />
                </div>
                {typingUsers.length > 0 && (
                  <div className='flex items-center justify-center gap-2 my-8 text-sm text-muted-foreground'>
                    <div className='flex items-center p-2 space-x-1 rounded-full bg-muted'>
                      <span className='w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]'></span>
                      <span className='w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]'></span>
                      <span className='w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]'></span>
                    </div>
                    Đang có {typingUsers.length} người đánh giá...
                  </div>
                )}
                <div className='mt-4'>
                  {(!product?.reviews || product?.reviews.length == 0) && (
                    <span className='pl-12 font-medium text-gray-400 text-md'>
                      Chưa có đánh giá!
                    </span>
                  )}
                  {product?.reviews[page - 1]?.comments.map(
                    (comment, index: number) => (
                      <div key={index}>
                        <div className='flex items-center gap-8 mb-4'>
                          <div className='flex gap-3 mb-1.5 w-[20%] min-w-44'>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className='cursor-pointer'>
                                    <AvatarImage src={comment?.buyerAvatar} />
                                    <AvatarFallback>LV</AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{comment?.buyerName}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div className='flex flex-col'>
                              <span className='mr-2 font-bold'>
                                {comment?.buyerName}
                              </span>

                              <span className='text-xs text-gray-400'>
                                {new Date(
                                  comment?.createdAt
                                ).toLocaleDateString('vi-VN', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center gap-4'>
                              <Rating
                                emptySymbol={<FaRegStar />}
                                fullSymbol={<FaStar />}
                                initialRating={comment?.rating || 0}
                                readonly
                                className='text-[#FBCA04] text-xl leading-none'
                              />
                              <span className='text-lg font-semibold leading-none'>
                                {COMMENTS[comment?.rating - 1]}
                              </span>
                            </div>

                            <div className='block py-2 mb-2 text-sm break-words mt-1/2'>
                              {comment?.content}
                            </div>

                            <div className='flex items-center gap-10 text-lg text-gray-500 cursor-pointer'>
                              <FaRegThumbsUp />
                              <FaRegCommentDots />
                              <IoShareSocialOutline />
                            </div>
                          </div>
                        </div>
                        {index <
                          product?.reviews[page - 1].comments?.length - 1 && (
                          <Separator className='my-6' />
                        )}
                      </div>
                    )
                  )}
                </div>
                <PaginationComponent
                  currentPage={page}
                  totalPages={product?.reviews.length}
                  handlePaginate={handlePaginate}
                />
              </div>
            </div>
          </div>

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
                <div className='font-semibold text-mainColor1-800'>
                  Số lượng:
                </div>
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
                  <Rating
                    emptySymbol={<FaRegStar />}
                    fullSymbol={<FaStar />}
                    initialRating={product?.rating || 0}
                    readonly
                    className='text-[#FBCA04] text-4xl leading-none flex-1'
                  />
                </div>
                <span className='text-sm text-gray-400'>
                  (
                  {
                    product.reviews.map((review) => review.comments).flat(1)
                      ?.length
                  }{' '}
                  đánh giá)
                </span>
              </div>

              <ReviewRate
                comments={product.reviews
                  .map((review) => review.comments)
                  .flat(1)}
              />
            </div>
          </div>
        </div>

        <div className='p-4 bg-white rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='w-3 rounded-sm h-7 bg-mainColor2-800'></div>
            <span className='text-sm font-semibold text-mainColor2-800'>
              Sản phẩm tương tự
            </span>
          </div>

          <div className='flex items-center justify-between mx-auto mt-3 text-2xl font-bold text-mainColor1-600'>
            Khám phá thêm các sản phẩm của chúng tôi!
            <Button className='px-8 bg-mainColor1-800 hover:bg-mainColor1-600'>
              Xem tất cả
            </Button>
          </div>

          <Separator className='my-4 h-[2px]' />

          <div className='list-recommended-products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5'>
            {recommendedProducts.length > 0
              ? recommendedProducts
                  .slice(0, DEFAULT_ITEMS_PER_PAGE)
                  .map((product) => (
                    <ProductCard
                      product={product}
                      key={product._id}
                      loading={false}
                    />
                  ))
              : [...Array(40)].map((_, index) => (
                  <ProductCard loading={true} key={index} />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}
