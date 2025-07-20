import http from "@/lib/http"
import { Brand } from "@/types/entities/brand"

export const BRAND_API_PREFIX = '/brands'

export const getBrandsApi = async () => {
  const response = await http.get<Brand[]>(BRAND_API_PREFIX)
  return response.data
}