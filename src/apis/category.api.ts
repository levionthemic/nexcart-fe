import http from "@/lib/http"
import { Category } from "@/types/entities/category"

export const CATEGORY_API_PREFIX = '/categories'

export const getCategoriesApi = async () => {
  const response = await http.get<Category[]>(CATEGORY_API_PREFIX)
  return response.data
}

export const getCategoriesBySlugApi = async (slug: string) => {
  const response = await http.get<Category>(`${CATEGORY_API_PREFIX}/${slug}`)
  return response.data
}