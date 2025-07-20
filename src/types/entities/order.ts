import { OrderStatus } from '../enums/order-status'
import { CartProductItem } from './cart'
import { Shop } from './shop'
import { Buyer, Seller } from './user'

export type OrderProductItem = Omit<CartProductItem, 'seller' | 'shopProductType'>
export interface OrderItem {
  product: OrderProductItem
  quantity: number
}

export interface Order {
  id: string
  originalPrice: number
  finalPrice: number
  status: OrderStatus
  note?: string
  shippingFee: number
  shippingMethod: string
  createdAt?: Date
  updatedAt?: Date
  
  buyer: Buyer
  seller: Seller
  shop: Shop
  orderItems: OrderItem[]
}
