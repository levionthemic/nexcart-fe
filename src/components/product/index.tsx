import { VariantHandlingProvider } from '@/contexts/variant-handling-context'
import ClientProductCard, { ProductCardPropTypes } from './product-card'

export function ProductCard({ product, loading }: ProductCardPropTypes) {
  const averagePrice = product
    ? Math.ceil(
        product.product_variants.reduce((sum, pv) => sum + pv.price, 0) /
          product.product_variants.length
      )
    : 0
  return (
    <VariantHandlingProvider initialProductEndPrice={averagePrice}>
      <ClientProductCard product={product} loading={loading} />
    </VariantHandlingProvider>
  )
}
