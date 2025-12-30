import { Brand } from './brand'
import { Category } from './category'
import { Review } from './review'
import { Shop } from './shop'
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
  imageUrl: string
}

export interface ProductVariant extends ProductVariantMinimal {
  shopProductVariants: ShopProductVariant[]
  productVariantOptionValues: ProductVariantOptionValue[]
}

export interface CartProductVariant extends ProductVariant {
  product: CartProduct
}

export interface ProductVariantOptionValue {
  optionValue: OptionValue
}

export interface OptionValue {
  value: string
  option: Option
  id: number
}

export interface Option {
  id: number
  name: string
}

export interface ProductSpecification {
  id: number
  field: string
  content: string
}

export interface ShopProductVariant {
  id: number
  shop: Shop
  stockQuantity: number
  soldQuantity: number
}

export interface ProductBase {
  id: number
  name: string
  sku: string
  description: string
  thumbnailUrl: string
  rating: number
  sold: number
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductListItem extends ProductBase {
  category: Category
  brand: Brand
  product_variants: ProductVariant[]
  seller: Seller
}

export interface Product extends ProductListItem {
  specifications: ProductSpecification[]
  reviews: Review[]
}

export interface CartProduct extends ProductBase {
  seller: Seller
}
