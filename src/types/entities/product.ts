import { Brand } from './brand'
import { Category } from './category'
import { Review } from './review'
import { Seller } from './user'

export interface ProductType {
  id: string
  name: string
  price: number
  discount: number
  weight: number
  length: number
  width: number
  height: number
}

export interface ProductFeature {
  id: string
  field: string
  content: string
}

export interface ShopProductType {
  id: string
  shopId: string
  productId: string
  typeId: string
  stock: number
}

export interface ProductBase {
  id: string
  name: string
  averagePrice: number
  description: string | null
  avatar: string | null
  rating: number
  sold: number
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductListItem extends ProductBase {
  category: Category
  brand: Brand
  types: ProductType[]
  shopProductTypes: ShopProductType[]
}

export interface Product extends ProductListItem {
  features: ProductFeature[]
  seller: Seller
  reviews: Review[]
}
