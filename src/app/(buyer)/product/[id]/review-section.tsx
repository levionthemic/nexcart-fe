'use client'

import React, { useRef, useState } from 'react'
import ReviewModal from './_components/review-modal'
// import { toast } from 'sonner'
// import { useSearchParams } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaRegCommentDots, FaRegThumbsUp } from 'react-icons/fa'
import { COMMENTS } from '@/utils/constants'
import { IoShareSocialOutline } from 'react-icons/io5'
import { Separator } from '@/components/ui/separator'
import PaginationComponent from '@/components/pagination/pagination'
import { Product } from '@/types/entities/product'
// import { useSelector } from 'react-redux'
// import { selectCurrentUser } from '@/redux/user/userSlice'
import { Ratings } from '@/components/ui/ratings'

export default function ReviewSection({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [page] = useState(1)

  // const [isTyping, setIsTyping] = useState<boolean>(false)
  const [typingUsers] = useState<string[]>([])

  // const searchParams = useSearchParams()
  // const productId = searchParams.get('productId')

  // const currentUser = useSelector(selectCurrentUser)

  const onSubmitReview = (data: { rating: number; content: string }) => {
    const reviewData = {
      productId: product.id,
      ...data,
      medias: []
    }

    console.log(reviewData)

    // toast.promise(addCommentAPI(reviewData), {
    //   loading: 'Đang gửi đánh giá...',
    //   success: (res) => {
    //     if (!res.error) {
    //       return 'Đánh giá thành công!'
    //     }
    //     throw res
    //   }
    // })
  }

  const updateStartTyping = () => {
    // if (!isTyping) {
    //   socketIoInstance.emit('FE_START_TYPING', {
    //     productId,
    //     userId: currentUser?._id
    //   })
    //   setIsTyping(true)
    // }
  }

  const updateStopTyping = () => {
    // socketIoInstance.emit('FE_STOP_TYPING', {
    //   productId,
    //   userId: currentUser?._id
    // })
    // setIsTyping(false)
  }

  // useEffect(() => {
  //   window.scrollTo(0, 0)

  //   socketIoInstance.emit('FE_JOIN_PRODUCT', productId)

  //   socketIoInstance.on(
  //     'BE_UPDATE_TYPING',
  //     ({ productId: id, users }: { productId: string; users: string[] }) => {
  //       if (id === productId)
  //         setTypingUsers(users.filter((id: string) => id !== currentUser?._id))
  //     }
  //   )

  //   socketIoInstance.on('BE_NEW_REVIEW', (data) => {
  //     setProduct((prevProduct) => {
  //       const newProduct = cloneDeep(prevProduct) as Product
  //       newProduct.reviews = data.reviewList
  //       newProduct.rating = data.updatedProduct.rating
  //       return newProduct
  //     })
  //   })

  //   return () => {
  //     socketIoInstance.emit('FE_LEAVE_PRODUCT', productId)
  //     socketIoInstance.off('BE_UPDATE_TYPING')
  //   }
  // }, [productId])

  return (
    <div className=''>
      <div
        className='relative p-4 mb-6 bg-white dark:bg-section rounded-lg h-fit'
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
          {product?.reviews?.[page - 1]?.comments.map(
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
                        {new Date(comment?.createdAt).toLocaleDateString(
                          'vi-VN',
                          {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-4'>
                      <Ratings
                        rating={comment?.rating || 0}
                        variant='yellow'
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
                {index < product?.reviews[page - 1].comments?.length - 1 && (
                  <Separator className='my-6' />
                )}
              </div>
            )
          )}
        </div>
        <PaginationComponent
          currentPage={page}
          totalPages={product.reviews?.length}
        />
      </div>
    </div>
  )
}
