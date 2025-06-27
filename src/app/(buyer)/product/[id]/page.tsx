import { getProductDetailsAPI, getProductsAPI } from '@/apis/buyerApis'
import { Button } from '@/components/ui/button'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

import { DEFAULT_ITEMS_PER_PAGE } from '@/utils/constants'
import ProductCard from '@/components/product'

import Image from 'next/image'
import ChooseType from './choose-type'
import ShowAddress from './show-address'
import ReviewSection from './review-section'
import QuantityHandling from './quantity-handling'
import { VariantHandlingProvider } from '@/contexts/variant-handling-context'
import WithPersistProvider from '@/components/providers/WithPersistProvider'
import { Ratings } from '@/components/ui/ratings'

export default async function ProductDetail({
  params
}: {
  params: { id: string }
}) {
  const awaitParams = await params
  const productId = awaitParams.id
  const product = await getProductDetailsAPI(String(productId))
  const recommendedProducts = (await getProductsAPI()).products

  // const handlePaginate = (page: number) => {
  //   sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  //   setTimeout(() => {
  //     window.scrollBy({ top: -120, behavior: 'smooth' })
  //   }, 500)
  //   setPage(page)
  // }

  return (
    <div className='bg-[#F5F5FA] py-4'>
      <div className='container mx-auto'>
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/buyer'>Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='#'>Sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <VariantHandlingProvider initialProductEndPrice={product.avgPrice}>
          <div className='relative grid grid-cols-4 gap-6'>
            <div className='col-span-3'>
              <div className='relative grid grid-cols-3 gap-6 mb-6 h-fit'>
                <div className='sticky left-0 flex items-center justify-center p-4 pb-32 bg-white rounded-lg h-fit top-36'>
                  <div className='overflow-hidden border rounded-2xl'>
                    <Image
                      width={350}
                      height={350}
                      src={product?.avatar}
                      alt={product?.name}
                      className='scale-105 object-cover'
                    />
                  </div>
                </div>

                <div className='col-span-2'>
                  <div className='p-4 mb-6 bg-white rounded-lg'>
                    <span className='inline-flex items-center px-2 py-1 mb-2 text-xs font-medium text-green-700 rounded-md bg-green-50 ring-1 ring-green-600/20 ring-inset'>
                      Còn hàng!
                    </span>
                    <div className='text-2xl font-bold text-mainColor1-600'>
                      {product?.name}
                    </div>

                    <div className='flex items-center gap-2 mt-2 text-sm'>
                      <span>{product?.rating || 0}</span>
                      <Ratings rating={product?.rating || 0} variant='yellow' />
                      <div
                        style={{ border: '1px solid #ddd', height: '20px' }}
                      ></div>
                      <div>Đã bán: {product?.sold || '0'}</div>
                    </div>

                    <ChooseType product={product} />
                  </div>

                  <div className='p-4 mb-6 bg-white rounded-lg'>
                    <div className='mb-1 text-lg font-semibold text-mainColor1-600'>
                      Thông tin vận chuyển
                    </div>
                    <WithPersistProvider>
                      <ShowAddress />
                    </WithPersistProvider>
                    <div className='w-full h-px my-2 border border-t-0 border-gray-200 divider'></div>
                    <div>GHTK</div>
                  </div>

                  <div className='p-4 mb-6 bg-white rounded-lg'>
                    <div className='mb-3 text-lg font-semibold text-mainColor1-600'>
                      Thông tin chi tiết
                    </div>
                    {product?.features?.map((feature, index) => (
                      <div key={index} className='mx-4'>
                        <div className='flex items-center justify-between my-1.5'>
                          <span className='text-sm text-gray-400'>
                            {feature.field}
                          </span>
                          <span className=''>{feature.content}</span>
                        </div>
                        {index != product?.features?.length - 1 && (
                          <Separator />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className='p-4 bg-white rounded-lg'>
                    <div className='mb-2 text-lg font-semibold text-mainColor1-800'>
                      Mô tả sản phẩm
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: product?.description }}
                      style={{ textAlign: 'justify' }}
                    />
                  </div>
                </div>
              </div>

              <WithPersistProvider>
                <ReviewSection product={product} />
              </WithPersistProvider>
            </div>

            <WithPersistProvider>
              <QuantityHandling product={product} />
            </WithPersistProvider>
          </div>
        </VariantHandlingProvider>

        <div className='p-4 bg-white rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='w-3 rounded-sm h-7 bg-mainColor2-800'></div>
            <span className='text-sm font-semibold text-mainColor2-800'>
              Sản phẩm tương tự
            </span>
          </div>

          <div className='flex items-center justify-between mx-auto mt-3 text-2xl font-bold text-mainColor1-600'>
            Khám phá thêm các sản phẩm của chúng tôi!
            <Button className='px-8 bg-mainColor1-800 hover:bg-mainColor1-600'>
              Xem tất cả
            </Button>
          </div>

          <Separator className='my-4 h-[2px]' />

          <div className='list-recommended-products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5'>
            {recommendedProducts.length > 0
              ? recommendedProducts
                  .slice(0, DEFAULT_ITEMS_PER_PAGE)
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
