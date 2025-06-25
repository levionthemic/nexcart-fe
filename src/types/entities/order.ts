import { OrderStatus } from '../enums/order-status'

export interface OrderItem {
  productId: string
  typeId: string
  productName?: string
  typeName?: string
  price?: number
  avatar?: string
  quantity: number
  _weight?: number
  _length?: number
  _width?: number
  _height?: number
}

export interface Order {
  _id?: string
  buyerId: string
  sellerId: string
  shopId: string
  orgPrice: number
  discountCode?: string[]
  finalPrice: number
  buyerPhone: string
  buyerName: string
  buyerEmail: string
  status: OrderStatus
  note?: string
  buyerAddress: {
    province: number
    district: number
    ward: string
    address: string
  }
  shippingFee: number
  shippingMethod: string
  itemList: OrderItem[]

  createdAt?: Date
  updatedAt?: Date
  _deleted?: boolean
}
