'use client'

import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'

import { ProductCard } from '@/components/product'
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel'
import { Category } from '@/types/entities/category'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

export default function CarouselCategories({
  categories
}: {
  categories: Category[]
}) {
  return (
    <Carousel plugins={[Autoplay({ playOnInit: true, delay: 10000 })]}>
      <CarouselContent>
        {categories.length > 0
          ? categories.map((category: Category) => (
              <CarouselItem
                className='basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6'
                key={category.id}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className='border-mainColor2-100 flex cursor-pointer flex-col items-center rounded-md border p-1 hover:border-[3px] hover:shadow-md'
                >
                  <Image
                    width={96}
                    height={96}
                    src={category.thumbnail_url || DEFAULT_IMAGE_URL}
                    alt=''
                    className='mb-1 size-24 rounded-md object-cover shadow-lg'
                  />
                  <div className='text-mainColor2-800 line-clamp-1 text-center font-medium'>
                    {category.name}
                  </div>
                </Link>
              </CarouselItem>
            ))
          : [...Array(6)].map((_, index) => (
              <ProductCard product={null} key={index} loading={true} />
            ))}
      </CarouselContent>
    </Carousel>
  )
}
