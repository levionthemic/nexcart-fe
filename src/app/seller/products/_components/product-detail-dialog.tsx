/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { EllipsisIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { getProductDetailsApi } from '@/apis/product.api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useLoading } from '@/contexts/loading-context'
import {
  Product,
  ProductListItem,
  ProductVariant
} from '@/types/entities/product'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

function ProductDetailDialog({
  productProp
}: {
  productProp: ProductListItem
}) {
  const [open, setOpen] = useState(false)
  const [product, setProduct] = useState<Product>()
  const { apiLoadingCount, startLoading, endLoading } = useLoading()
  useEffect(() => {
    if (open) {
      startLoading()
      getProductDetailsApi(productProp.slug)
        .then((data) => setProduct(data))
        .finally(() => endLoading())
    }
  }, [open])

  const averagePrice = product
    ? Math.ceil(
        product.product_variants.reduce((sum, item) => sum + item.price, 0) /
          product.product_variants.length
      )
    : 0

  const totalStock = (product_variant: ProductVariant) => {
    return product_variant.shop_product_variants.reduce(
      (sum, item) => sum + item.stock_quantity,
      0
    )
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          className='size-7 shadow-none'
          aria-label='More item'
          title='Xem chi tiết sản phẩm'
        >
          <EllipsisIcon size={16} aria-hidden='true' />
        </Button>
      </DialogTrigger>

      {apiLoadingCount > 0 ? (
        <div className='sm:max-w-[425px]'>Đang tải dữ liệu</div>
      ) : (
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Báo cáo vi phạm</DialogTitle>
            <DialogDescription>
              Gửi báo cáo vi phạm lên Quản trị viên.
            </DialogDescription>
          </DialogHeader>

          {/* Hình ảnh sản phẩm */}
          <div className='flex justify-center py-4'>
            <Image
              src={product?.thumbnail_url || DEFAULT_IMAGE_URL}
              alt={product?.name ?? ''}
              width={160}
              height={160}
              className='rounded-lg object-cover shadow-md'
            />
          </div>

          {/* Thông tin chi tiết */}
          <div className='space-y-2 text-sm'>
            <p>
              <strong>Thương hiệu:</strong> {product?.brand.name}
            </p>
            <p>
              <strong>Danh mục:</strong> {product?.category.name}
            </p>
            <p>
              <strong>Giá trung bình:</strong> {averagePrice.toLocaleString()} đ
            </p>
            <p>
              <strong>Đã bán:</strong> {product?.sold} sản phẩm
            </p>
            <p>
              <strong>Đánh giá:</strong> {product?.rating} ⭐
            </p>
          </div>

          {/* Đặc điểm nổi bật */}
          <div className='mt-4'>
            <h3 className='font-semibold'>Đặc điểm sản phẩm:</h3>
            <ul className='list-inside list-disc text-sm text-gray-700'>
              {product?.specifications.map((specifications, index) => (
                <li key={index}>
                  <strong>{specifications.field}:</strong>{' '}
                  {specifications.content}
                </li>
              ))}
            </ul>
          </div>

          {/* Các loại sản phẩm */}
          <div className='mt-4'>
            <h3 className='font-semibold'>Các phiên bản:</h3>
            <ul className='list-inside list-disc text-sm text-gray-700'>
              {product?.product_variants.map((pv) => (
                <li key={pv.id}>
                  {pv.name} - {pv.price.toLocaleString()} đ (Còn:{' '}
                  {totalStock(pv)})
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
            <Button>
              <Link href={'/seller/products/edit'}>Chỉnh sửa sản phẩm</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default ProductDetailDialog
