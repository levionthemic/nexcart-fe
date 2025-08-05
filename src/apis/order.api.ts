import { ClusterOrderListItem } from '@/contexts/order-context'
import http from '@/lib/http'
import { Order } from '@/types/entities/order'
import { ShippingMethod } from '@/types/enums/checkout'
import { OrderStatus } from '@/types/enums/order-status'

export const ORDER_API_PREFIX = '/orders'

export type AddOrderPayload = {
  sellerId: string
  shopId: string
  buyerAddressId: string
  originalPrice: number
  discountCode: string
  note: string
  finalPrice: number
  shippingFee: number
  shippingMethod: ShippingMethod
  orderItems: {
    productId: string
    typeId: string
    quantity: number
    unitPrice: number
    discount: number
    finalPrice: number
  }[]
}

export const getOrdersApi = async () => {
  const response = await http.get<Order[]>(ORDER_API_PREFIX, {
    credentials: 'include'
  })
  return response.data
}

export const clusterOrdersApi = async (data) => {
  const response = await http.post<ClusterOrderListItem[]>(
    `${ORDER_API_PREFIX}/cluster`,
    data,
    { credentials: 'include' }
  )
  return response.data
}

export const addOrderApi = async (data: AddOrderPayload) => {
  const response = await http.post<Order>(`${ORDER_API_PREFIX}/create`, data, {
    credentials: 'include'
  })
  return response.data!
}

export const updateOrderStatusApi = async (data: {
  orderId: string
  status: OrderStatus
}) => {
  const response = await http.put<Order>(`${ORDER_API_PREFIX}/update`, data, {
    credentials: 'include'
  })
  return response.data
}
