import { OrderStatus } from '../enums/order-status'

import { Address } from './address'
import { ProductVariant } from './product'
import { Shop } from './shop'
import { Buyer, Seller } from './user'

export interface OrderItem {
  product_variant: ProductVariant
  quantity: number
  price_at_purchase: number
}

export interface Order {
  id: number
  order_code: string
  final_price: number
  status: OrderStatus
  note?: string
  shipping_fee: number
  shipping_method: string
  created_at?: Date
  updated_at?: Date

  buyer_address: Address
  buyerAddressString?: string
  buyer: Buyer
  seller: Seller
  shop: Shop
  order_items: OrderItem[]
}
