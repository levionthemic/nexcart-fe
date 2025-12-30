import { Buyer } from './user'

export interface Review {
  id?: number
  productVariantId: number

  rating: number
  content: string
  buyer: Buyer

  createdAt?: Date
  updatedAt?: Date
  isDeleted?: boolean
}
