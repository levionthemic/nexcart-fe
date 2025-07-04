import http from '@/lib/http'
import { Brand } from '@/types/entities/brand'
import { Category } from '@/types/entities/category'
import { OrderItem } from '@/types/entities/order'
import { Product } from '@/types/entities/product'
import authorizedAxiosInstance from '@/utils/authorizedAxios'

/**
 * Products APIs
 * @author levi
 */
export const getProductsAPI = async (searchPath = '') => {
  const response = await http.get<getProductsApiResponse>(
    `/product${searchPath}`
  )
  return response.payload
}
export type getProductsApiResponse = {
  products: Product[]
  totalProducts: number
  categories: Category[]
  brands: Brand[]
}

export const getProductsWithFiltersAPI = async (searchPath = '') => {
  const response = await http.get<getProductsApiResponse>(
    `/product/filter${searchPath}`
  )
  return response.payload
}

export const getProductDetailsAPI = async (productId: string | undefined) => {
  const response = await http.get<Product>(`/product/${productId}`)
  return response.payload
}

export const updateProductDetailAPI = async (
  productId: string,
  updateData: Product
) => {
  const response = await authorizedAxiosInstance.put(
    `/product/${productId}`,
    updateData
  )
  return response.data
}

/**
 * Review APIs
 * @author levi
 */
export const addCommentAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('/review/add', data)
  return response.data
}

/**
 * Review APIs
 * @author taiki and levi
 */
export const fetchOrdersAPI = async () => {
  const response = await authorizedAxiosInstance.get('/order/get-all')
  return response.data
}

export const addOrderAPI = async (data, buyNow = false) => {
  const response = await authorizedAxiosInstance.post(
    `/order/add${buyNow && '?buyNow=1'}`,
    data
  )
  return response.data
}

export const clusterOrderAPI = async (data: OrderItem[]) => {
  const response = await authorizedAxiosInstance.post('/order/cluster', { itemList: data })
  return response.data
}
