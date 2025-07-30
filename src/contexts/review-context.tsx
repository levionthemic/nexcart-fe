'use client'

import { Review } from '@/types/entities/review'
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react'

type ReviewContextType = {
  reviews: Review[]
  setReviews: Dispatch<SetStateAction<Review[]>>
  ratingAverage: number
  setRatingAverage: Dispatch<SetStateAction<number>>
  totalReviews: number
  setTotalReviews: Dispatch<SetStateAction<number>>
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

type ReviewProviderProps = {
  children: ReactNode
}

export const ReviewProvider = ({ children }: ReviewProviderProps) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingAverage, setRatingAverage] = useState<number>(0)
  const [totalReviews, setTotalReviews] = useState<number>(0)

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        setReviews,
        ratingAverage,
        setRatingAverage,
        totalReviews,
        setTotalReviews
      }}
    >
      {children}
    </ReviewContext.Provider>
  )
}

export const useReview = (): ReviewContextType => {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider')
  }
  return context
}
