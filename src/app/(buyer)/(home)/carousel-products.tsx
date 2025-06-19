'use client'

import ProductCard from '@/components/product/product-card'

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel'
import { Product } from '@/types/entities/product'
import Autoplay from 'embla-carousel-autoplay'

export default function CarouselProducts({
  bestSellingProducts
}: {
  bestSellingProducts: Product[]
}) {
  return (
    <Carousel plugins={[Autoplay({ playOnInit: true, delay: 3000 })]}>
      <CarouselContent>
        {bestSellingProducts.length > 0
          ? bestSellingProducts.map((product: Product) => (
              <CarouselItem
                className='basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6'
                key={product._id}
              >
                <ProductCard product={product} loading={false} />
              </CarouselItem>
            ))
          : [...Array(6)].map((_, index) => (
              <ProductCard key={index} loading={true} />
            ))}
      </CarouselContent>
    </Carousel>
  )
}
