import ProductCard from '@/components/product/product-card'
import { getProductsAPI, getProductsWithFiltersAPI } from '@/apis/buyerApis'

import { DEFAULT_ITEMS_PER_PAGE } from '@/utils/constants'
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
  const searchObject: {
    page?: number
    'q[name]'?: string
    'q[rating]'?: string
    'q[minPrice]'?: string
    'q[maxPrice]'?: string
    'q[categoryId]'?: string
    'q[brandId]'?: string
  } = {
    'q[name]': searchParams.keyword,
    page: searchParams.page
  }

  let products: Product[] = [],
    totalProducts = 1,
    categories: Category[] = [],
    brands: Brand[] = []

  if (
    searchParams.rating ||
    searchParams.minPrice ||
    searchParams.maxPrice ||
    searchParams.categoryId ||
    searchParams.brandId
  ) {
    if (searchParams.rating) searchObject['q[rating]'] = searchParams.rating

    if (searchParams.minPrice && searchParams.maxPrice) {
      searchObject['q[minPrice]'] = searchParams.minPrice
      searchObject['q[maxPrice]'] = searchParams.maxPrice
    }
    if (searchParams.categoryId)
      searchObject['q[categoryId]'] = searchParams.categoryId

    if (searchParams.brandId) searchObject['q[brandId]'] = searchParams.brandId

    const data = await getProductsWithFiltersAPI(searchObject.toString())
    products = data.products
    totalProducts = data.totalProducts
  } else {
    const data = await getProductsAPI(searchObject.toString())
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
                Kết quả tìm kiếm cho &quot;{searchParams.keyword}&quot;
              </span>
              <span>Trang {searchParams.page}</span>
            </div>

            <div className='grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {apiLoadingCount > 0 ? (
                <>
                  {Array.from({ length: 40 }).map((_, index) => (
                    <ProductCard loading={true} key={index} />
                  ))}
                </>
              ) : (
                <>
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
                          // width={'minmax(250px, 1fr)'}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </div>

            <div className='flex flex-row-reverse my-6'>
              <PaginationComponent
                currentPage={Number(searchParams.page)}
                totalPages={Math.ceil(totalProducts / DEFAULT_ITEMS_PER_PAGE)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
