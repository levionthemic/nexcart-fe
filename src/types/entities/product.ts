import { Brand } from './brand'
import { Category } from './category'
import { Review } from './review'
import { Seller } from './user'

export interface ProductVariantMinimal {
  id: number
  name: string
  sku: string
  price: number
  discount: number
  weight: number
  length: number
  width: number
  height: number
  image_url: string
}

export interface ProductVariant extends ProductVariantMinimal {
  shop_product_variants: ShopProductVariant[]
}

export interface ProductSpecification {
  id: number
  field: string
  content: string
}

export interface ShopProductVariant {
  id: number
  shop_id: number
  product_variant_id: number
  stock_quantity: number
  sold_quantity: number
}

export interface ProductBase {
  id: number
  name: string
  sku: string
  description: string
  thumbnail_url: string
  rating: number
  sold: number
  slug: string
  created_at: Date
  updated_at: Date
}

export interface ProductListItem extends ProductBase {
  category: Category
  brand: Brand
  product_variants: ProductVariant[]
}

export interface Product extends ProductListItem {
  specifications: ProductSpecification[]
  seller: Seller
  reviews: Review[]
}
