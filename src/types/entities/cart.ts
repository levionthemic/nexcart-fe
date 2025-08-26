import { CartProductVariant } from './product'

export interface CartItem {
  product_variant: CartProductVariant
  quantity: number
}

export interface Cart {
  id: number
  buyer_id?: string
  cart_items: CartItem[]
}
