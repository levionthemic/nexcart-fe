import http from '@/lib/http'
import { Review } from '@/types/entities/review'

export const getReviewsByProductIdApi = async (
  productId: number,
  searchPath = ''
) => {
  const response = await http.get<{ reviewList: Review[]; total: number }>(
    `/reviews/${productId}?${searchPath}`
  )
  return response.data
}

export const addReviewApi = async (reviewData: {
  productId: number
  rating: number
  content: string
}) => {
  const response = await http.post<{
    reviewList: Review[]
    ratingAverage: number
  }>('/reviews/create', reviewData, {
    credentials: 'include'
  })
  return response.data
}
