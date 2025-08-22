import { CreateProductFormSchemaType } from '@/app/seller/products/add/create-product-form'
import http from '@/lib/http'
import { Brand } from '@/types/entities/brand'
import { Category } from '@/types/entities/category'
import { Product, ProductListItem } from '@/types/entities/product'

export const PRODUCT_API_PREFIX = '/products'

export type GetProductsWithFiltersResponseType = {
  products: ProductListItem[]
  categories: Category[]
  brands: Brand[]
  meta: { total: number; page: number; limit: number }
}

export type GetProductsResponstType = {
  data: ProductListItem[]
  meta: { total: number; page: number; limit: number }
}

export const getProductsApi = async () => {
  const response = await http.get<GetProductsResponstType>(`${PRODUCT_API_PREFIX}`)
  return response.data
}

export const getSellerProductsApi = async (sellerId: string) => {
  const response = await http.get<GetProductsResponstType>(`${PRODUCT_API_PREFIX}/seller/${sellerId}`)
  return response.data
}

export const getProductsWithFiltersApi = async (searchPath = '') => {
  const response = await http.get<GetProductsWithFiltersResponseType>(
    `${PRODUCT_API_PREFIX}/filter${searchPath}`
  )
  return response.data
}

export const getProductDetailsApi = async (slug: string | undefined) => {
  const response = await http.get<Product>(`${PRODUCT_API_PREFIX}/${slug}`)
  return response.data
}

export const createProductApi = async (data: CreateProductFormSchemaType) => {
  const response = await http.post(`${PRODUCT_API_PREFIX}/create`, data, {
    credentials: 'include'
  })
  return response.data
}