import { ProductBase, ProductType, ShopProductType } from './product'
import { Seller } from './user'

export type CartProductItem = Pick<ProductBase, 'id' | 'name' | 'avatar'> & {
  seller: Seller,
  type: ProductType
  shopProductType: ShopProductType
}
export interface CartItem {
  product: CartProductItem
  quantity: number
  subRows?: CartItem[]
}

export interface Cart {
  id: string
  buyerId: string
  cartItems: CartItem[]
}
