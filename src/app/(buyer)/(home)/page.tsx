import { useEffect, useState } from 'react'
import ProductCard from '@/components/product/product-card'
import CategoryBar from './category-bar'
import { getCategoriesAPI, getProductsAPI } from '@/apis/buyerApis'

import { FaShippingFast } from 'react-icons/fa'
import { MdSupportAgent } from 'react-icons/md'
import { MdCurrencyExchange } from 'react-icons/md'
import { MdHighQuality } from 'react-icons/md'

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { DEFAULT_ITEMS_PER_PAGE } from '@/utils/constants'

import banner from '@/assets/banner.jpg'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useLoading } from '@/contexts/LoadingContext'
import { Product } from '@/types/entities/product'
import { Category } from '@/types/entities/category'
import Image from 'next/image'

function HomePage() {
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [productsDisplayed] = useState(DEFAULT_ITEMS_PER_PAGE)
  const [categories, setCategories] = useState([])
  const { startLoading, endLoading } = useLoading()

  useEffect(() => {
    startLoading()
    getProductsAPI()
      .then((data) => {
        const bestSellingProducts = data.products
        const recommendedProducts = data.products
        setBestSellingProducts(bestSellingProducts)
        setRecommendedProducts(recommendedProducts)
      })
      .finally(() => endLoading())
  }, [])

  useEffect(() => {
    startLoading()
    getCategoriesAPI()
      .then((data) => setCategories(data))
      .finally(() => endLoading())
  }, [])

  const handleClickCategory = (categoryId: string): void => {
    //
  }

  const targetDate = new Date('2025-06-10T23:59:00').getTime()
  const [timeLeft, setTimeLeft] = useState(targetDate - new Date().getTime())

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now
      setTimeLeft(difference)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor((milliseconds / 1000) % 60)
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60)
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24)
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
    return { days, hours, minutes, seconds }
  }

  const { days, hours, minutes, seconds } = formatTime(timeLeft)

  return (
    <div className='bg-[#F5F5FA]'>
      <div className='container py-6 mx-auto'>
        <div className='grid grid-cols-5 gap-4'>
          <SidebarProvider className='col-span-1 px-3 py-4 bg-white rounded-lg min-h-96'>
            <CategoryBar
              categories={categories}
              onClickCategory={handleClickCategory}
            />
          </SidebarProvider>
          <div className='col-span-4'>
            <Image
              src={banner}
              alt=''
              className='h-[416px] w-full object-cover rounded-md'
            />
          </div>
        </div>

        <div className='p-4 mt-16 bg-white rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='w-3 rounded-sm h-7 bg-mainColor2-800'></div>
            <span className='text-sm font-semibold text-mainColor2-800'>
              Hôm nay
            </span>
          </div>

          <div className='flex items-center gap-32 mt-6 mb-4'>
            <span className='text-3xl font-semibold tracking-wide text-red-500'>
              Flash sales!
            </span>

            <ul className='flex items-center gap-8'>
              <li className='flex flex-col items-start font-semibold'>
                <span className='text-xs'>Ngày</span>
                <span className='text-3xl'>
                  {days < 10 ? `0${days}` : days}
                </span>
              </li>
              <li className='text-2xl text-red-500 text-bold'>:</li>
              <li className='flex flex-col items-start font-semibold'>
                <span className='text-xs'>Giờ</span>
                <span className='text-3xl'>
                  {hours < 10 ? `0${hours}` : hours}
                </span>
              </li>
              <li className='text-2xl text-red-500 text-bold'>:</li>
              <li className='flex flex-col items-start font-semibold'>
                <span className='text-xs'>Phút</span>
                <span className='text-3xl'>
                  {minutes < 10 ? `0${minutes}` : minutes}
                </span>
              </li>
              <li className='text-2xl text-red-500 text-bold'>:</li>
              <li className='flex flex-col items-start font-semibold'>
                <span className='text-xs'>Giây</span>
                <span className='text-3xl'>
                  {seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </li>
            </ul>
          </div>

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

          <div className='flex items-center justify-center mt-6'>
            <Button className='px-10 py-5 bg-mainColor1-800 hover:bg-mainColor1-600'>
              Xem tất cả
            </Button>
          </div>
        </div>

        <div className='p-4 mt-16 bg-white rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='w-3 rounded-sm h-7 bg-mainColor2-800'></div>
            <span className='text-sm font-semibold text-mainColor2-800'>
              Danh mục
            </span>
          </div>

          <div className='mt-2 mb-4 text-2xl font-semibold text-mainColor1-800'>
            Duyệt danh mục sản phẩm
          </div>

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
        </div>

        <div className='p-4 mt-16 bg-white rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='w-3 rounded-sm h-7 bg-mainColor2-800'></div>
            <span className='text-sm font-semibold text-mainColor2-800'>
              Tháng này
            </span>
          </div>

          <div className='flex items-center justify-between mx-auto mt-3 text-2xl font-bold text-mainColor1-600'>
            Sản phẩm bán chạy
            <Button className='px-8 bg-mainColor1-800 hover:bg-mainColor1-600'>
              Xem tất cả
            </Button>
          </div>

          <Separator className='my-4 h-[2px]' />

          <Carousel plugins={[Autoplay({ playOnInit: true, delay: 3000 })]}>
            <CarouselContent>
              {bestSellingProducts.length > 0
                ? bestSellingProducts.map((product) => (
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
        </div>

        <div className='p-4 my-16 bg-white rounded-lg'>
          <div className='flex items-center gap-2 mb-3'>
            <div className='w-3 rounded-sm h-7 bg-mainColor2-800'></div>
            <span className='text-sm font-semibold text-mainColor2-800'>
              Chính sách của chúng tôi
            </span>
          </div>
          <div className='grid grid-cols-2 gap-8 text-mainColor1-400 lg:grid-cols-4'>
            <div className='flex flex-col items-center'>
              <FaShippingFast className='my-4 text-4xl' />
              <span className='mb-1 text-xl font-semibold'>
                Giao hàng nhanh chóng
              </span>
              <p className='text-sm text-justify text-gray-400'>
                Chúng tôi cam kết giao hàng nhanh chóng trong 1-3 ngày làm việc,
                đảm bảo đơn hàng đến tay bạn an toàn và đúng hẹn. Hỗ trợ nhiều
                phương thức vận chuyển linh hoạt, theo dõi đơn hàng dễ dàng
              </p>
            </div>
            <div className='flex flex-col items-center'>
              <MdSupportAgent className='my-4 text-4xl' />
              <span className='mb-1 text-xl font-semibold'>
                Hỗ trợ trực tuyến
              </span>
              <p className='text-sm text-justify text-gray-400'>
                Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 qua chat, email và
                hotline. Đội ngũ chăm sóc khách hàng chuyên nghiệp sẽ giải đáp
                mọi thắc mắc nhanh chóng, giúp bạn có trải nghiệm mua sắm tốt
                nhất!
              </p>
            </div>
            <div className='flex flex-col items-center'>
              <MdCurrencyExchange className='my-4 text-4xl' />
              <span className='mb-1 text-xl font-semibold'>
                Hoàn tiền nhanh chóng
              </span>
              <p className='text-sm text-justify text-gray-400'>
                Chúng tôi cam kết hoàn tiền dễ dàng, nhanh chóng trong vòng 3-5
                ngày làm việc nếu sản phẩm không đúng như mô tả hoặc có lỗi từ
                nhà sản xuất. Quy trình đơn giản, minh bạch, đảm bảo quyền lợi
                tốt nhất cho khách hàng!
              </p>
            </div>
            <div className='flex flex-col items-center'>
              <MdHighQuality className='my-4 text-4xl' />
              <span className='mb-1 text-xl font-semibold'>
                Sản phẩm chất lượng cao
              </span>
              <p className='text-sm text-justify text-gray-400'>
                Chúng tôi cam kết cung cấp sản phẩm chính hãng, chất lượng cao,
                được kiểm định kỹ lưỡng trước khi giao đến tay khách hàng. Mỗi
                sản phẩm đều đảm bảo độ bền, kiểu dáng đẹp và an toàn khi sử
                dụng.
              </p>
            </div>
          </div>
        </div>

        <div className='p-4 mt-16 bg-white rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='w-3 rounded-sm h-7 bg-mainColor2-800'></div>
            <span className='text-sm font-semibold text-mainColor2-800'>
              Sản phẩm
            </span>
          </div>

          <div className='flex items-center justify-between mx-auto mt-3 text-2xl font-bold text-mainColor1-600'>
            Khám phá các sản phẩm của chúng tôi
            <Button className='px-8 bg-mainColor1-800 hover:bg-mainColor1-600'>
              Xem tất cả
            </Button>
          </div>

          <Separator className='my-4 h-[2px]' />

          <div className='list-recommended-products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5'>
            {recommendedProducts.length > 0
              ? recommendedProducts
                  .slice(0, productsDisplayed)
                  .map((product) => (
                    <ProductCard
                      product={product}
                      key={product._id}
                      loading={false}
                    />
                  ))
              : [...Array(40)].map((_, index) => (
                  <ProductCard loading={true} key={index} />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
