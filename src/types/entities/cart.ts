import { ProductVariant } from './product'

export interface CartItem {
  product_variant: ProductVariant
  quantity: number
  subRows?: CartItem[]
}

export interface Cart {
  id: number
  buyer_id: string
  cart_items: CartItem[]
}
