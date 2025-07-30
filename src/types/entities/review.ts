import { Buyer } from './user'

export interface Review {
  id?: string
  productId: string

  rating: number
  content: string
  buyer: Buyer

  createdAt?: Date
  updatedAt?: Date
  isDeleted?: boolean
}
