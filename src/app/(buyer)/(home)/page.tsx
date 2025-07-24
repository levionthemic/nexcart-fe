import ProductCard from '@/components/product'
import CategoryBar from './category-bar'

import { FaShippingFast } from 'react-icons/fa'
import { MdSupportAgent } from 'react-icons/md'
import { MdCurrencyExchange } from 'react-icons/md'
import { MdHighQuality } from 'react-icons/md'

import { DEFAULT_ITEMS_PER_PAGE } from '@/utils/constants'

import banner from '@/assets/banner.jpg'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import CountDown from './countdown'
import CarouselProducts from './carousel-products'
import CarouselCategories from './carousel-categories'
import { getProductsApi } from '@/apis/product.api'
import { getCategoriesApi } from '@/apis/category.api'
import Link from 'next/link'

export default async function HomePage() {
  const productsData = await getProductsApi()
  const bestSellingProducts = productsData?.data || []
  const recommendedProducts = productsData?.data || []

  const categories = (await getCategoriesApi()) || []

  return (
    <div className='bg-[#F5F5FA] dark:bg-background'>
      <div className='container py-6 mx-auto'>
        <div className='grid grid-cols-5 gap-4'>
          <SidebarProvider className='col-span-1 pl-3 pr-1 py-4 bg-white dark:bg-sidebar rounded-lg min-h-96'>
            <CategoryBar
              categories={categories || []}
              // onClickCategory={handleClickCategory}
            />
          </SidebarProvider>
          <div className='col-span-4'>
            <Image
              width={undefined}
              height={416}
              src={banner}
              alt=''
              className='h-[416px] w-full object-cover rounded-md'
            />
          </div>
        </div>

        <div className='p-4 mt-16 bg-white dark:bg-section rounded-lg'>
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

            <CountDown />
          </div>

          <CarouselProducts bestSellingProducts={bestSellingProducts} />

          <div className='flex items-center justify-center mt-6'>
            <Link href='/product'>
              <Button className='px-10 py-5 bg-mainColor1-800 hover:bg-mainColor1-600'>
                Xem tất cả
              </Button>
            </Link>
          </div>
        </div>

        <div className='p-4 mt-16 bg-white dark:bg-section rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='w-3 rounded-sm h-7 bg-mainColor2-800'></div>
            <span className='text-sm font-semibold text-mainColor2-800'>
              Danh mục
            </span>
          </div>

          <div className='mt-2 mb-4 text-2xl font-semibold text-mainColor1-800'>
            Duyệt danh mục sản phẩm
          </div>

          <CarouselCategories categories={categories} />
        </div>

        <div className='p-4 mt-16 bg-white dark:bg-section rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='w-3 rounded-sm h-7 bg-mainColor2-800'></div>
            <span className='text-sm font-semibold text-mainColor2-800'>
              Tháng này
            </span>
          </div>

          <div className='flex items-center justify-between mx-auto mt-3 text-2xl font-bold text-mainColor1-600'>
            Sản phẩm bán chạy
            <Link href='/product'>
              <Button className='px-10 py-5 bg-mainColor1-800 hover:bg-mainColor1-600'>
                Xem tất cả
              </Button>
            </Link>
          </div>

          <Separator className='my-4 h-[2px]' />

          <CarouselProducts bestSellingProducts={bestSellingProducts} />
        </div>

        <div className='p-4 my-16 bg-white dark:bg-section rounded-lg'>
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

        <div className='p-4 mt-16 bg-white dark:bg-section rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='w-3 rounded-sm h-7 bg-mainColor2-800'></div>
            <span className='text-sm font-semibold text-mainColor2-800'>
              Sản phẩm
            </span>
          </div>

          <div className='flex items-center justify-between mx-auto mt-3 text-2xl font-bold text-mainColor1-600'>
            Khám phá các sản phẩm của chúng tôi
            <Link href='/product'>
              <Button className='px-10 py-5 bg-mainColor1-800 hover:bg-mainColor1-600'>
                Xem tất cả
              </Button>
            </Link>
          </div>

          <Separator className='my-4 h-[2px]' />

          <div className='list-recommended-products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5'>
            {recommendedProducts.length > 0
              ? recommendedProducts
                  .slice(0, DEFAULT_ITEMS_PER_PAGE)
                  .map((product) => (
                    <ProductCard
                      product={product}
                      key={product.id}
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
