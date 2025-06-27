/* eslint-disable no-useless-catch */
import http from '@/lib/http'
import { Brand } from '@/types/entities/brand'
import { Category } from '@/types/entities/category'
import { Product } from '@/types/entities/product'
import authorizedAxiosInstance from '@/utils/authorizedAxios'

export type getProductsApiResponse = {
  products: Product[]
  totalProducts: number
  categories: Category[]
  brands: Brand[]
}

/**
 * Dashboard APIs
 * @author taiki and levi
 */
export const getLatestOrdersAPI = async () => {
  try {
    const response = await authorizedAxiosInstance.get(
      '/order/seller/get-all?latest=1'
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const getBestSoldProductsAPI = async () => {
  try {
    const response = await authorizedAxiosInstance.get(
      '/product/seller/get-all?q[sold]=-1'
    )
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Store APIs
 * @author taiki and levi
 */

/**
 * Products APIs
 * @author taiki and levi
 */
export const getProductsAPI = async () => {
  const response = await http.get<getProductsApiResponse>('/product/seller/get-all')
  return response.payload
}


/**
 * Order APIs
 * @author taiki and levi
 */
export const fetchOrdersAPI = async () => {
  const response = await authorizedAxiosInstance.get('/order/seller/get-all')
  return response.data
}

export const updateOrderStatusAPI = async (data) => {
  try {
    const response = await authorizedAxiosInstance.post(
      '/order/seller/update-status',
      data
    )
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Promotion APIs
 * @author taiki and levi
 */

/**
 * Review APIs
 * @author taiki and levi
 */
