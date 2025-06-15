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
  avgPrice: number
  rating: number
  sold: number
  reviews: [{
    comments: [{
      content: string
      rating: number
      createdAt: Date
      buyerName: string
      buyerAvatar: string
    }]
  }]
  features: [{ field: string; content: string }]
  description: string
  quantityInStock: number
}
