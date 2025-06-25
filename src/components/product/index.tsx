import React from 'react'
import ClientProductCard, { ProductCardPropTypes } from './product-card'
import WithPersistProvider from '../providers/WithPersistProvider'

export default function ProductCard(props: ProductCardPropTypes) {
  return (
    <WithPersistProvider>
      <ClientProductCard {...props} />
    </WithPersistProvider>
  )
}
