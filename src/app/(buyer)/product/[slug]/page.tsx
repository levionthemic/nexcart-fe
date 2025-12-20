/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, Star, Store, UserPlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar } from 'react-icons/fa'

import { getProductDetailsApi, getProductsApi } from '@/apis/product.api'
import { ProductCard } from '@/components/product'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Ratings } from '@/components/ui/ratings'
import { Separator } from '@/components/ui/separator'
import { ReviewProvider } from '@/contexts/review-context'
import { VariantHandlingProvider } from '@/contexts/variant-handling-context'
import { DEFAULT_IMAGE_URL, DEFAULT_ITEMS_PER_PAGE } from '@/utils/constants'

import ChooseProductVariant from './choose-product-variant'
import QuantityHandling from './quantity-handling'
import ReviewSection from './review-section'
import ShowAddress from './show-address'

export default async function ProductDetail({ params }: any) {
  const awaitParams = await params
  const productSlug = awaitParams.slug
  const product = await getProductDetailsApi(String(productSlug))
  const recommendedProducts = (await getProductsApi())?.data

  const averagePrice = product
    ? Math.ceil(
        product.product_variants.reduce((sum, pv) => sum + pv.price, 0) /
          product.product_variants.length
      )
    : 0

  return (
    <div className='dark:bg-background bg-[#F5F5FA] py-4'>
      <div className='container mx-auto'>
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/product'>Sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <VariantHandlingProvider initialProductEndPrice={averagePrice}>
          <ReviewProvider>
            <div className='relative grid grid-cols-4 gap-6'>
              <div className='col-span-3'>
                <div className='relative mb-6 grid grid-cols-3 gap-6'>
                  <div className='dark:bg-section sticky top-36 h-fit self-start rounded-lg bg-white p-4'>
                    <div className='overflow-hidden rounded-2xl border'>
                      <Image
                        width={350}
                        height={350}
                        src={product?.thumbnail_url || DEFAULT_IMAGE_URL}
                        alt={String(product?.name)}
                        className='scale-105 object-cover'
                      />
                    </div>
                    <div className='custom-scrollbar mt-2 flex flex-wrap gap-2 overflow-x-auto'>
                      {product.product_variants.map((variant) => (
                        <div key={variant.id} className=''>
                          <Image
                            width={80}
                            height={80}
                            src={variant.image_url || DEFAULT_IMAGE_URL}
                            alt={variant.name}
                            className='h-20 w-20 cursor-pointer rounded-lg border hover:border-2'
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='col-span-2'>
                    <div className='dark:bg-section mb-6 rounded-lg bg-white p-4'>
                      <span className='mb-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset'>
                        Còn hàng!
                      </span>
                      <div className='text-mainColor1-600 text-2xl font-bold'>
                        {product?.name}
                      </div>

                      <div className='mt-2 flex items-center gap-2 text-sm'>
                        <span>{product?.rating || 0}</span>
                        <Ratings
                          rating={product?.rating || 0}
                          variant='yellow'
                        />
                        <div
                          style={{ border: '1px solid #ddd', height: '20px' }}
                        ></div>
                        <div>Đã bán: {product?.sold || '0'}</div>
                      </div>

                      {product && <ChooseProductVariant product={product} />}
                    </div>

                    <div className='bg-section mb-6 flex items-center gap-4 rounded-lg p-4'>
                      <div className='flex items-center gap-4'>
                        <Image
                          src={product?.seller.user.avatar || DEFAULT_IMAGE_URL}
                          alt='Avatar'
                          width={80}
                          height={80}
                          className='h-20 w-20 rounded-full border object-cover'
                        />
                        <div className='space-y-2'>
                          <h2 className='text-mainColor1-600 dark:text-foreground text-base font-medium'>
                            {product?.seller.name || 'Chưa có tên'}
                          </h2>
                          <div className='dark:text-muted-foreground flex items-center gap-2 text-base'>
                            <Button
                              variant='outline'
                              className='bg-mainColor1-200/50! border-mainColor1-400! hover:bg-mainColor1-200! flex items-center gap-1 border px-2! py-0.5!'
                            >
                              <Plus /> Theo dõi
                            </Button>
                            <Link
                              href={`/shop/${product?.seller.user.user_id}`}
                            >
                              <Button
                                variant='outline'
                                className='flex items-center gap-1 px-2! py-0.5!'
                              >
                                <Store />
                                Xem shop
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <Separator
                        orientation='vertical'
                        className='bg-muted-foreground h-18!'
                      />
                      <div className='flex-1 space-y-2'>
                        <div className='flex items-center'>
                          <div className='text-muted-foreground flex w-[40%] items-center gap-2 text-sm'>
                            <Star size={14} />
                            <span>Đánh giá</span>
                          </div>
                          <div className='flex-1 leading-none'>
                            4.5 / 5{' '}
                            <FaStar
                              className='mr-3 ml-1 inline text-yellow-400'
                              size={16}
                            />
                            (5.5tr+)
                          </div>
                        </div>
                        <div className='flex items-center'>
                          <div className='text-muted-foreground flex w-[40%] items-center gap-2 text-sm'>
                            <UserPlus size={14} />
                            <span>Theo dõi</span>
                          </div>
                          <div className='flex-1'>510.5k+</div>
                        </div>
                      </div>
                      <div className=''></div>
                    </div>

                    <div className='bg-section mb-6 rounded-lg p-4'>
                      <div className='text-mainColor1-600 mb-1 text-lg font-semibold'>
                        Thông tin vận chuyển
                      </div>
                      <ShowAddress />
                      <div className='divider my-2 h-px w-full border border-t-0 border-gray-200'></div>
                      <div>GHTK</div>
                    </div>

                    <div className='bg-section mb-6 rounded-lg p-4'>
                      <div className='text-mainColor1-600 mb-3 text-lg font-semibold'>
                        Thông tin chi tiết
                      </div>
                      {product?.specifications?.map((specification, index) => (
                        <div key={index} className='mx-4'>
                          <div className='my-1.5 flex items-center justify-between'>
                            <span className='text-sm text-gray-400'>
                              {specification.field}
                            </span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: specification.content
                              }}
                              style={{ textAlign: 'justify' }}
                            />
                          </div>
                          {index != product?.specifications?.length - 1 && (
                            <Separator />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className='bg-section rounded-lg p-4'>
                      <div className='text-mainColor1-800 mb-2 text-lg font-semibold'>
                        Mô tả sản phẩm
                      </div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: String(product?.description)
                        }}
                        style={{ textAlign: 'justify' }}
                      />
                    </div>
                  </div>
                </div>

                {product && <ReviewSection product={product} />}
              </div>

              {product && <QuantityHandling product={product} />}
            </div>
          </ReviewProvider>
        </VariantHandlingProvider>

        <div className='bg-section rounded-lg p-4'>
          <div className='flex items-center gap-2'>
            <div className='bg-mainColor2-800 h-7 w-3 rounded-sm'></div>
            <span className='text-mainColor2-800 text-sm font-semibold'>
              Sản phẩm tương tự
            </span>
          </div>

          <div className='text-mainColor1-600 mx-auto mt-3 flex items-center justify-between text-2xl font-bold'>
            Khám phá thêm các sản phẩm của chúng tôi!
            <Button className='bg-mainColor1-800 hover:bg-mainColor1-600 px-8'>
              Xem tất cả
            </Button>
          </div>

          <Separator className='my-4 h-[2px]' />

          <div className='list-recommended-products grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
            {recommendedProducts && recommendedProducts.length > 0
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
