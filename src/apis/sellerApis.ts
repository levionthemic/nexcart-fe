/* eslint-disable no-useless-catch */
import authorizedAxiosInstance from '@/utils/authorizedAxios'

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
      '/products/seller/get-all?q[sold]=-1'
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
  const response = await authorizedAxiosInstance.get('/products/seller/get-all')
  return response.data
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
