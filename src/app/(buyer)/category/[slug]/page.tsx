/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import { getCategoriesBySlugApi } from '@/apis/category.api'
import { Category } from '@/types/entities/category'
import {
  DEFAULT_IMAGE_URL,
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE
} from '@/utils/constants'
import CategoryBar from '../../(home)/category-bar'
import { SidebarProvider } from '@/components/ui/sidebar'
import PaginationComponent from '@/components/pagination/pagination'
import { getProductsWithFiltersApi } from '@/apis/product.api'
import { ProductCard } from '@/components/product'
import Link from 'next/link'
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
    <div className='container mx-auto py-6 relative'>
      <div className='flex gap-4 relative'>
        {/* Sidebar menu danh mục con */}
        {category.is_leaf === false ? (
          <SidebarProvider className='w-1/5 px-2 py-4 bg-white dark:bg-sidebar rounded-lg sticky top-36 h-[80vh] min-h-[80vh]'>
            <CategoryBar
              categories={category.children || []}
              className='flex-1 h-full! min-h-full!'
            />
          </SidebarProvider>
        ) : (
          <div className='w-[20%] px-6 h-full sticky top-36 left-0 max-h-full'>
            <div className='text-xl font-medium text-mainColor2-800'>
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
          <div className='text-2xl font-bold bg-section rounded-lg p-4'>
            {category.name}
          </div>

          {category.is_leaf === false && (
            <div className='bg-section rounded-lg p-4'>
              <span className='font-semibold text-lg'>
                Khám phá theo danh mục
              </span>
              <div className='grid grid-cols-6 gap-6 mt-6'>
                {category.children?.map((sub) => (
                  <Link
                    key={sub.id}
                    className='block p-2 text-center border border-transparent hover:border-mainColor1-600 rounded-lg cursor-pointer transition-all'
                    href={`/category/${sub.slug}`}
                  >
                    <Image
                      src={sub.thumbnail_url || DEFAULT_IMAGE_URL}
                      width={64}
                      height={64}
                      alt={sub.name}
                      className='mx-auto mb-2 w-16 h-16 object-cover rounded-full shadow-md'
                    />
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Lưới sản phẩm */}
          <div className='bg-section shadow-md rounded-lg p-4'>
            <div className='text-lg font-semibold mb-4'>Tất cả sản phẩm</div>
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
          <div className='flex flex-row-reverse my-6'>
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
