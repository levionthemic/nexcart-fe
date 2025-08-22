import { Buyer } from './user'

export interface Review {
  id?: number
  product_variant_id: number

  rating: number
  content: string
  buyer: Buyer

  created_at?: Date
  updated_at?: Date
  is_deleted?: boolean
}
