import { AddShopFormSchemaType } from "@/app/seller/store/storelist/_components/add-shop"
import http from "@/lib/http"
import { Shop } from "@/types/entities/shop"

export const getShopsApi = async () => {
  const response = await http.get<Shop[]>('/shop', { credentials: 'include' })
  return response.data
}

export const addNewShopApi = async (data: AddShopFormSchemaType) => {
  const response = await http.post('/shop/add', data, {
    credentials: 'include'
  })
  return response
}