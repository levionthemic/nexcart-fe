'use client'

import ProductCard from "@/components/product/product-card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Category } from "@/types/entities/category"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

export default function CarouselCategories({ categories }: { categories: Category[] }) {
  return (
    <Carousel plugins={[Autoplay({ playOnInit: true, delay: 10000 })]}>
      <CarouselContent>
        {categories.length > 0
          ? categories.map((category: Category) => (
              <CarouselItem
                className='basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6'
                key={category._id}
              >
                <div className='border border-mainColor2-100 rounded-md flex flex-col items-center p-1 cursor-pointer hover:border-[3px] hover:shadow-md'>
                  <Image
                    width={0}
                    height={0}
                    src={category.avatar}
                    alt=''
                    className='object-cover w-24 h-24 mb-1'
                  />
                  <div className='font-medium text-center text-mainColor2-800 line-clamp-1'>
                    {category.name}
                  </div>
                </div>
              </CarouselItem>
            ))
          : [...Array(6)].map((_, index) => (
              <ProductCard key={index} loading={true} />
            ))}
      </CarouselContent>
    </Carousel>
  )
}
