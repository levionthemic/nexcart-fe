import Image from 'next/image'
import Link from 'next/link'
import { FaShippingFast } from 'react-icons/fa'
import {
  MdCurrencyExchange,
  MdHighQuality,
  MdSupportAgent
} from 'react-icons/md'

import { getCategoriesApi } from '@/apis/category.api'
import { getProductsApi } from '@/apis/product.api'
import banner from '@/assets/banner.jpg'
import { ProductCard } from '@/components/features/product'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider } from '@/components/ui/sidebar'
import { DEFAULT_ITEMS_PER_PAGE } from '@/utils/constants'

import CarouselCategories from './_components/carousel-categories'
import CarouselProducts from './_components/carousel-products'
import CategoryBar from './_components/category-bar'
import CountDown from './_components/countdown'

export const dynamic = 'force-dynamic'
export default async function HomePage() {
  let categories = []
  let bestSellingProducts = []
  let recommendedProducts = []
  try {
    const productsData = await getProductsApi()
    bestSellingProducts = productsData?.data || []
    recommendedProducts = productsData?.data || []
    categories = (await getCategoriesApi()) || []
  } catch (error) {
    throw error
  }

  return (
    <div className='dark:bg-background bg-[#F5F5FA]'>
      <div className='container mx-auto py-6'>
        <div className='grid grid-cols-5 gap-4'>
          <SidebarProvider className='dark:bg-sidebar col-span-1 min-h-96 rounded-lg bg-white py-4 pr-1 pl-3'>
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
              className='h-[416px] w-full rounded-md object-cover'
            />
          </div>
        </div>

        <div className='dark:bg-section mt-16 rounded-lg bg-white p-4'>
          <div className='flex items-center gap-2'>
            <div className='bg-mainColor2-800 h-7 w-3 rounded-sm'></div>
            <span className='text-mainColor2-800 text-sm font-semibold'>
              Hôm nay
            </span>
          </div>

          <div className='mt-6 mb-4 flex items-center gap-32'>
            <span className='text-3xl font-semibold tracking-wide text-red-500'>
              Flash sales!
            </span>

            <CountDown />
          </div>

          <CarouselProducts bestSellingProducts={bestSellingProducts} />

          <div className='mt-6 flex items-center justify-center'>
            <Link href='/product'>
              <Button className='bg-mainColor1-800 hover:bg-mainColor1-600 px-10 py-5'>
                Xem tất cả
              </Button>
            </Link>
          </div>
        </div>

        <div className='dark:bg-section mt-16 rounded-lg bg-white p-4'>
          <div className='flex items-center gap-2'>
            <div className='bg-mainColor2-800 h-7 w-3 rounded-sm'></div>
            <span className='text-mainColor2-800 text-sm font-semibold'>
              Danh mục
            </span>
          </div>

          <div className='text-mainColor1-800 mt-2 mb-4 text-2xl font-semibold'>
            Duyệt danh mục sản phẩm
          </div>

          <CarouselCategories categories={categories} />
        </div>

        <div className='dark:bg-section mt-16 rounded-lg bg-white p-4'>
          <div className='flex items-center gap-2'>
            <div className='bg-mainColor2-800 h-7 w-3 rounded-sm'></div>
            <span className='text-mainColor2-800 text-sm font-semibold'>
              Tháng này
            </span>
          </div>

          <div className='text-mainColor1-600 mx-auto mt-3 flex items-center justify-between text-2xl font-bold'>
            Sản phẩm bán chạy
            <Link href='/product'>
              <Button className='bg-mainColor1-800 hover:bg-mainColor1-600 px-10 py-5'>
                Xem tất cả
              </Button>
            </Link>
          </div>

          <Separator className='my-4 h-[2px]' />

          <CarouselProducts bestSellingProducts={bestSellingProducts} />
        </div>

        <div className='dark:bg-section my-16 rounded-lg bg-white p-4'>
          <div className='mb-3 flex items-center gap-2'>
            <div className='bg-mainColor2-800 h-7 w-3 rounded-sm'></div>
            <span className='text-mainColor2-800 text-sm font-semibold'>
              Chính sách của chúng tôi
            </span>
          </div>
          <div className='text-mainColor1-400 grid grid-cols-2 gap-8 lg:grid-cols-4'>
            <div className='flex flex-col items-center'>
              <FaShippingFast className='my-4 text-4xl' />
              <span className='mb-1 text-xl font-semibold'>
                Giao hàng nhanh chóng
              </span>
              <p className='text-justify text-sm text-gray-400'>
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
              <p className='text-justify text-sm text-gray-400'>
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
              <p className='text-justify text-sm text-gray-400'>
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
              <p className='text-justify text-sm text-gray-400'>
                Chúng tôi cam kết cung cấp sản phẩm chính hãng, chất lượng cao,
                được kiểm định kỹ lưỡng trước khi giao đến tay khách hàng. Mỗi
                sản phẩm đều đảm bảo độ bền, kiểu dáng đẹp và an toàn khi sử
                dụng.
              </p>
            </div>
          </div>
        </div>

        <div className='dark:bg-section mt-16 rounded-lg bg-white p-4'>
          <div className='flex items-center gap-2'>
            <div className='bg-mainColor2-800 h-7 w-3 rounded-sm'></div>
            <span className='text-mainColor2-800 text-sm font-semibold'>
              Sản phẩm
            </span>
          </div>

          <div className='text-mainColor1-600 mx-auto mt-3 flex items-center justify-between text-2xl font-bold'>
            Khám phá các sản phẩm của chúng tôi
            <Link href='/product'>
              <Button className='bg-mainColor1-800 hover:bg-mainColor1-600 px-10 py-5'>
                Xem tất cả
              </Button>
            </Link>
          </div>

          <Separator className='my-4 h-[2px]' />

          <div className='list-recommended-products grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
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
                  <ProductCard product={null} loading={true} key={index} />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}
