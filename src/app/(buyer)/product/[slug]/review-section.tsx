'use client'

import React, { useEffect, useRef, useState } from 'react'
import ReviewModal from './_components/review-modal'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaRegCommentDots, FaRegThumbsUp } from 'react-icons/fa'
import { COMMENTS } from '@/utils/constants'
import { IoShareSocialOutline } from 'react-icons/io5'
import { Separator } from '@/components/ui/separator'
import PaginationComponent from '@/components/pagination/pagination'
import { Product } from '@/types/entities/product'
import { Ratings } from '@/components/ui/ratings'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { addReviewApi, getReviewsByProductIdApi } from '@/apis/review.api'
import { toast } from 'sonner'
import { useReview } from '@/contexts/review-context'

export default function ReviewSection({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)
  const itemsPerPage = 6

  const currentUser = useSelector(selectCurrentUser)

  const {
    reviews,
    setReviews,
    setTotalReviews,
    totalReviews,
    setRatingAverage
  } = useReview()
  
  useEffect(() => {
    if (product.id) {
      const searchPath = `page=${page}&per=${itemsPerPage}`
      getReviewsByProductIdApi(product.id, searchPath).then((data) => {
        if (data) {
          setReviews(data.reviewList)
          setTotalReviews(data.total)
        }
      })
    }
  }, [product.id, page])

   const handlePaginate = (page: number) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => {
      window.scrollBy({ top: -120, behavior: 'smooth' })
    }, 500)
    setPage(page)
  }

  const onSubmitReview = (data: { rating: number; content: string }) => {
    const reviewData = {
      productId: product.id,
      ...data
    }

    toast.promise(addReviewApi(reviewData), {
      loading: 'Đang xử lý...',
      success: (data) => {
        if (data) {
          setReviews(data.reviewList)
          setRatingAverage(data.ratingAverage)
          setTotalReviews(prev => prev + 1)
        }
        return 'Đánh giá thành công!'
      },
      error: 'Không thể tạo đánh giá!'
    })
  }
  return (
    <div className=''>
      <div
        className='relative p-4 mb-6 bg-white dark:bg-section rounded-lg h-fit'
        ref={sectionRef}
      >
        <div className='flex items-center justify-between'>
          <div>
            <div className='text-xl font-semibold text-mainColor2-800'>
              Đánh giá sản phẩm
            </div>
            <p className='text-sm text-muted-foreground'>
              Bạn có thể xem các đánh giá từ các khách hàng khác.
            </p>
          </div>
          {currentUser && <ReviewModal onSubmitReview={onSubmitReview} />}
        </div>
        <div className='mt-4'>
          {(!reviews || reviews.length == 0) && (
            <span className='pl-12 font-medium text-gray-400 text-md'>
              Chưa có đánh giá!
            </span>
          )}
          {reviews?.map((review, index: number) => (
            <div key={index}>
              <div className='flex items-center gap-8 mb-4'>
                <div className='flex gap-3 mb-1.5 w-[20%] min-w-44'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className='cursor-pointer'>
                          <AvatarImage src={review.buyer.user.avatar} />
                          <AvatarFallback>LV</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{review.buyer.user.name || "Ẩn danh"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className='flex flex-col'>
                    <span className='mr-2 font-bold'>
                      {review.buyer.user.name || "Ẩn danh"}
                    </span>

                    <span className='text-xs text-gray-400'>
                      {new Date(review.createdAt!).toLocaleDateString('vi-VN', {
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
                    <Ratings rating={review.rating || 0} variant='yellow' />
                    <span className='text-lg font-semibold leading-none'>
                      {COMMENTS[review.rating - 1]}
                    </span>
                  </div>

                  <div className='block py-2 mb-2 text-sm break-words mt-1/2'>
                    {review?.content}
                  </div>

                  <div className='flex items-center gap-10 text-lg text-gray-500 cursor-pointer'>
                    <FaRegThumbsUp />
                    <FaRegCommentDots />
                    <IoShareSocialOutline />
                  </div>
                </div>
              </div>
              {index < reviews.length - 1 && <Separator className='my-6' />}
            </div>
          ))}
        </div>
        <PaginationComponent
          currentPage={page}
          totalPages={Math.ceil(totalReviews / itemsPerPage)}
          externalHandlePaginate={handlePaginate}
        />
      </div>
    </div>
  )
}
