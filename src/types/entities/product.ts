import { Review } from './review'
import { User } from './user'

export interface ProductType {
  typeId: string
  typeName: string
  price: number
  stock: number
  discount: number
}
export interface Product {
  _id: string
  name: string
  avatar: string
  types: ProductType[]
  type: ProductType
  sellerId: string
  seller: User
  averagePrice: number
  rating: number
  sold: number
  reviews: Review[]
  features: [{ field: string; content: string }]
  description: string
  quantityInStock: number
}
