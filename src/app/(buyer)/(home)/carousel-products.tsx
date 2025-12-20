'use client'

import Autoplay from 'embla-carousel-autoplay'

import { ProductCard } from '@/components/product'
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel'
import { ProductListItem } from '@/types/entities/product'

export default function CarouselProducts({
  bestSellingProducts
}: {
  bestSellingProducts: ProductListItem[]
}) {
  return (
    <Carousel plugins={[Autoplay({ playOnInit: true, delay: 3000 })]}>
      <CarouselContent>
        {bestSellingProducts.length > 0
          ? bestSellingProducts.map((product: ProductListItem) => (
              <CarouselItem
                className='basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6'
                key={product.id}
              >
                <ProductCard product={product} loading={false} />
              </CarouselItem>
            ))
          : [...Array(6)].map((_, index) => (
              <ProductCard product={null} key={index} loading={true} />
            ))}
      </CarouselContent>
    </Carousel>
  )
}
