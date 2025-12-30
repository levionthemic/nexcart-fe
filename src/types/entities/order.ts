import { OrderStatus } from '../enums/order-status'

import { Address } from './address'
import { ProductVariant } from './product'
import { Shop } from './shop'
import { Buyer, Seller } from './user'

export interface OrderItem {
  productVariant: ProductVariant
  quantity: number
  priceAtPurchase: number
}

export interface Order {
  id: number
  orderCode: string
  finalPrice: number
  status: OrderStatus
  note?: string
  shippingFee: number
  shippingMethod: string
  createdAt?: Date
  updatedAt?: Date

  buyerAddress: Address
  buyerAddressString?: string
  buyer: Buyer
  seller: Seller
  shop: Shop
  orderItems: OrderItem[]
}
