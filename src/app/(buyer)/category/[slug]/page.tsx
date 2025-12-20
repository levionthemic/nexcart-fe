/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import Link from 'next/link'

import { getCategoriesBySlugApi } from '@/apis/category.api'
import { getProductsWithFiltersApi } from '@/apis/product.api'
import { ProductCard } from '@/components/features/product'
import PaginationComponent from '@/components/shared/pagination'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Category } from '@/types/entities/category'
import {
  DEFAULT_IMAGE_URL,
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE
} from '@/utils/constants'

import CategoryBar from '../../(home)/category-bar'
import ProductFilterForm from '../../product/filter-form'

export default async function CategoryDetailPage({
  params,
  searchParams
}: any) {
  const awaitParams = await params
  const awaitSearchparams = await searchParams
  const slug = awaitParams.slug
  const page = Number(awaitSearchparams.page) || DEFAULT_PAGE
  const category: Category = await getCategoriesBySlugApi(slug)

  const data = await getProductsWithFiltersApi(
    `?q[category_id]=${category.id}&page=${page}`
  )
  const products = data?.products || []
  const totalProducts = data?.meta.total || 0
  const categories = data?.categories || []
  const brands = data?.brands || []

  return (
    <div className='relative container mx-auto py-6'>
      <div className='relative flex gap-4'>
        {/* Sidebar menu danh mục con */}
        {category.is_leaf === false ? (
          <SidebarProvider className='dark:bg-sidebar sticky top-36 h-[80vh] min-h-[80vh] w-1/5 rounded-lg bg-white px-2 py-4'>
            <CategoryBar
              categories={category.children || []}
              className='h-full! min-h-full! flex-1'
            />
          </SidebarProvider>
        ) : (
          <div className='sticky top-36 left-0 h-full max-h-full w-[20%] px-6'>
            <div className='text-mainColor2-800 text-xl font-medium'>
              Bộ lọc sản phẩm
            </div>

            <div className='mt-4'>
              <ProductFilterForm categories={categories} brands={brands} />
            </div>
          </div>
        )}

        {/* Nội dung bên phải */}
        <main className='flex-1 space-y-6'>
          {/* Tiêu đề danh mục */}
          <div className='bg-section rounded-lg p-4 text-2xl font-bold'>
            {category.name}
          </div>

          {category.is_leaf === false && (
            <div className='bg-section rounded-lg p-4'>
              <span className='text-lg font-semibold'>
                Khám phá theo danh mục
              </span>
              <div className='mt-6 grid grid-cols-6 gap-6'>
                {category.children?.map((sub) => (
                  <Link
                    key={sub.id}
                    className='hover:border-mainColor1-600 block cursor-pointer rounded-lg border border-transparent p-2 text-center transition-all'
                    href={`/category/${sub.slug}`}
                  >
                    <Image
                      src={sub.thumbnail_url || DEFAULT_IMAGE_URL}
                      width={64}
                      height={64}
                      alt={sub.name}
                      className='mx-auto mb-2 h-16 w-16 rounded-full object-cover shadow-md'
                    />
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Lưới sản phẩm */}
          <div className='bg-section rounded-lg p-4 shadow-md'>
            <div className='mb-4 text-lg font-semibold'>Tất cả sản phẩm</div>
          </div>
          <div className='grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
            {!products?.length ? (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '80px',
                  color: '#555',
                  width: '100%'
                }}
              >
                <h2>Không tìm thấy sản phẩm</h2>
                <p>Hãy thử tìm kiếm với từ khóa khác.</p>
              </div>
            ) : (
              <>
                {products.map((product, index) => (
                  <ProductCard product={product} loading={false} key={index} />
                ))}
              </>
            )}
          </div>
          {/* Phân trang */}
          <div className='my-6 flex flex-row-reverse'>
            <PaginationComponent
              currentPage={Number(page || DEFAULT_PAGE)}
              totalPages={Math.ceil(totalProducts / DEFAULT_ITEMS_PER_PAGE)}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
