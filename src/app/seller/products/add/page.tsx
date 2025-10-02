import CreateProductForm from './create-product-form'
import PageHeader from '../../_components/page-header'
import { getCategoriesApi } from '@/apis/category.api'
import { getBrandsApi } from '@/apis/brand.api'

export default async function CreateProductPage() {
  const categories = await getCategoriesApi() || []
  const brands = await getBrandsApi() || []

  console.log(brands)
  return (
    <div className='px-6 py-4'>
      <PageHeader
        links={[
          {
            link: '/seller',
            label: 'Dashboard'
          },
          {
            link: '/seller/products',
            label: 'Sản phẩm'
          },
          {
            link: '/seller/products',
            label: 'Quản lý sản phẩm'
          }
        ]}
        title={'Thêm sản phẩm'}
      />

      <div className='bg-white p-4 rounded-lg'>
        <CreateProductForm categories={categories} brands={brands} />
      </div>
    </div>
  )
}
