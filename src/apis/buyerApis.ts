import { Product } from '@/types/entities/product'
import authorizedAxiosInstance from '@/utils/authorizedAxios'

/**
 * Products APIs
 * @author levi
 */
export const getProductsAPI = async (searchPath = '') => {
  const response = await authorizedAxiosInstance.get(`/products${searchPath}`)
  return response.data
}

export const getProductsWithFiltersAPI = async (searchPath = '') => {
  const response = await authorizedAxiosInstance.get(
    `/products/filter${searchPath}`
  )
  return response.data
}

export const getProductDetailsAPI = async (productId: string | undefined) => {
  const response = await authorizedAxiosInstance.get(`/products/${productId}`)
  return response.data
}

export const updateProductDetailAPI = async (
  productId: string,
  updateData: Product
) => {
  const response = await authorizedAxiosInstance.put(
    `/products/${productId}`,
    updateData
  )
  return response.data
}

/**
 * Categories APIs
 * @author levi
 */
export const getCategoriesAPI = async () => {
  const response = await authorizedAxiosInstance.get('/categories')
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

export const clusterOrderAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('/order/cluster', data)
  return response.data
}
