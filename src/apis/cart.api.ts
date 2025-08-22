import http from '@/lib/http'
import { AddCartItemPayload } from '@/redux/cart/cartSlice'
import { Cart } from '@/types/entities/cart'

export const CART_API_PREFIX = '/cart'

export const getCartApi = async () => {
  const response = await http.get<Cart>(CART_API_PREFIX, {
    credentials: 'include'
  })
  return response.data
}

export const addCartItemApi = async (data: AddCartItemPayload) => {
  const response = await http.post<Cart>(`${CART_API_PREFIX}/add`, data, {
    credentials: 'include'
  })
  return response.data
}

export const updateCartItemQuantityApi = async (data: AddCartItemPayload) => {
  const response = await http.put<Cart>(`${CART_API_PREFIX}/update`, data, {
    credentials: 'include'
  })
  return response.data
}

export const deleteCartItemApi = async (
  data: Omit<AddCartItemPayload, 'quantity'>
) => {
  const response = await http.put(`${CART_API_PREFIX}/delete`, data, {
    credentials: 'include'
  })
  console.log('ok')
  return response.data
}
