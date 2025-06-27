import React from 'react'
import CreateProductForm from './create-product-form'
import PageHeader from '../../_components/page-header'

export default function CreateProductPage() {
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
        <CreateProductForm />
      </div>
    </div>
  )
}
