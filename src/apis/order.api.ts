import { ClusterOrderListItem } from "@/contexts/order-context"
import http from "@/lib/http"
import { Order } from "@/types/entities/order"

export const ORDER_API_PREFIX = '/orders'

export const getOrdersApi = async () => {
  const response = await http.get<Order[]>('/order/seller/get-all')
  return response.data
}

export const clusterOrdersApi = async (data) => {
  const response = await http.post<ClusterOrderListItem[]>(`${ORDER_API_PREFIX}/cluster`, data, { credentials: 'include' })
  return response.data
}