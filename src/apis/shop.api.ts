import { AddShopFormSchemaType } from "@/app/seller/store/storelist/_components/add-shop"
import http from "@/lib/http"
import { Shop } from "@/types/entities/shop"

export const SHOP_API_PREFIX = '/shops'

export const getShopsApi = async () => {
  const response = await http.get<Shop[]>(SHOP_API_PREFIX, { credentials: 'include' })
  return response.data
}

export const addNewShopApi = async (data: AddShopFormSchemaType) => {
  const response = await http.post(`${SHOP_API_PREFIX}/add`, data, {
    credentials: 'include'
  })
  return response
}