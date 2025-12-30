import { CartProductVariant } from './product'

export interface CartItem {
  productVariant: CartProductVariant
  quantity: number
}

export interface Cart {
  id: number
  buyerId?: string
  cartItems: CartItem[]
}
