import { Product, ProductType } from './product'

export interface CartItem {
  productId: string
  typeId: string
  quantity: number
}

export interface FullProductItem extends Product {
  _id: string
  sellerId: string
  avatar: string
  name: string
  type: ProductType
}

export interface Cart {
  buyerId: string
  itemList: CartItem[]
  fullProducts: FullProductItem[]
}
