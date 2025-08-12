import http from "@/lib/http"
import { User } from "@/types/entities/user"

export const USER_API_PREFIX = '/users'

export const getPublicSellerProfileApi = async (sellerId: string) => {
  const response = await http.get<User>(`${USER_API_PREFIX}/seller/${sellerId}`)
  return response.data
}