import { ClusterOrderListItem } from '@/contexts/order-context'
import http from '@/lib/http'
import { Order } from '@/types/entities/order'
import { ShippingMethod } from '@/types/enums/checkout'
import { OrderStatus } from '@/types/enums/order-status'

export const ORDER_API_PREFIX = '/orders'

export type AddOrderPayload = {
  seller_id: string
  shop_id: number
  buyer_address_id: number
  original_price: number
  discount_code: string
  note: string
  final_price: number
  shipping_fee: number
  shipping_method: ShippingMethod
  order_items: {
    product_variant_id: number
    quantity: number
    price_at_purchase: number
  }[]
}

export type ClusterOrderPayload = {
  order_items: {
    product_variant_id: number
    quantity: number
  }[] 
}

export const getOrdersApi = async () => {
  const response = await http.get<Order[]>(ORDER_API_PREFIX)
  return response.data
}

export const clusterOrdersApi = async (data: ClusterOrderPayload) => {
  const response = await http.post<ClusterOrderListItem[]>(
    `${ORDER_API_PREFIX}/cluster`,
    data
  )
  return response.data
}

export const addOrderApi = async (data: AddOrderPayload) => {
  const response = await http.post<Order>(`${ORDER_API_PREFIX}/create`, data)
  return response.data!
}

export const updateOrderStatusApi = async (data: {
  orderId: string
  status: OrderStatus
}) => {
  const response = await http.put<Order>(`${ORDER_API_PREFIX}/update`, data)
  return response.data
}
