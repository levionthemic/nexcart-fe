import ProductCard from '@/components/product'
import { getProductsAPI, getProductsWithFiltersAPI } from '@/apis/buyerApis'

import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '@/utils/constants'
import PaginationComponent from '@/components/pagination/pagination'

import { Category } from '@/types/entities/category'
import { Brand } from '@/types/entities/brand'
import ProductFilterForm, { SearchObjectType } from './filter-form'
import { Product } from '@/types/entities/product'

export default async function ProductList({
  searchParams
}: {
  searchParams: SearchObjectType
}) {
  const params = await searchParams

  const page = Number(params.page) || DEFAULT_PAGE
  const keyword = params.keyword
  const rating = params.rating
  const minPrice = params.minPrice
  const maxPrice = params.maxPrice
  const categoryId = params.categoryId
  const brandId = params.brandId

  const searchObject: {
    page?: number
    'q[name]'?: string
    'q[rating]'?: string
    'q[minPrice]'?: string
    'q[maxPrice]'?: string
    'q[categoryId]'?: string
    'q[brandId]'?: string
  } = {
    page: page
  }

  let products: Product[] = [],
    totalProducts = 1,
    categories: Category[] = [],
    brands: Brand[] = []

  if (keyword || rating || minPrice || maxPrice || categoryId || brandId) {
    if (keyword) searchObject['q[name]'] = keyword
    if (rating) searchObject['q[rating]'] = rating

    if (minPrice && maxPrice) {
      searchObject['q[minPrice]'] = minPrice
      searchObject['q[maxPrice]'] = maxPrice
    }
    if (categoryId)
      searchObject['q[categoryId]'] = categoryId

    if (brandId) searchObject['q[brandId]'] = brandId

    const searchPath = Object.entries(searchObject)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    const data = await getProductsWithFiltersAPI(`?${searchPath}`)
    products = data.products
    totalProducts = data.totalProducts
  } else {
    const searchPath = Object.entries(searchObject)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    const data = await getProductsAPI(`?${searchPath}`)
    products = data.products
    totalProducts = data.totalProducts
    categories = data.categories
    brands = data.brands
  }

  return (
    <div className='container mx-auto my-6'>
      <div className='relative flex h-full gap-6'>
        <div className='w-[20%] px-6 h-full sticky top-36 left-0 max-h-full'>
          <div className='text-xl font-medium text-mainColor2-800'>
            Bộ lọc sản phẩm
          </div>

          <div className='mt-4'>
            <ProductFilterForm categories={categories} brands={brands} />
          </div>
        </div>

        <div className='flex-1'>
          <div>
            <div className='flex items-end justify-between mb-4'>
              <span className='text-xl font-medium text-mainColor2-800'>
                Kết quả tìm kiếm cho &quot;{keyword}&quot;
              </span>
              <span>Trang {page}</span>
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
                    <ProductCard
                      product={product}
                      loading={false}
                      key={index}
                    />
                  ))}
                </>
              )}
            </div>

            <div className='flex flex-row-reverse my-6'>
              <PaginationComponent
                currentPage={Number(page || DEFAULT_PAGE)}
                totalPages={Math.ceil(totalProducts / DEFAULT_ITEMS_PER_PAGE)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
