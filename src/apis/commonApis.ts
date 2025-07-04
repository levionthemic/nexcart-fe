import http from "@/lib/http"
import { Brand } from "@/types/entities/brand"
import { Category } from "@/types/entities/category"

/**
 * Categories APIs
 * @author levi
 */
export const getCategoriesAPI = async () => {
  const response = await http.get<Category[]>('/category')
  return response.payload
}

/**
 * Brands APIs
 * @author levi
 */
export const getBrandsAPI = async () => {
  const response = await http.get<Brand[]>('/brand')
  return response.payload
}