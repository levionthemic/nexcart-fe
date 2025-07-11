'use client'

import { EllipsisIcon } from 'lucide-react'
import Image from 'next/image'
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
import { Product } from '@/types/entities/product'
import Link from 'next/link'

function ProductDetailDialog({ product }: { product: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          className='shadow-none'
          aria-label='More item'
        >
          <EllipsisIcon size={16} aria-hidden='true' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Báo cáo vi phạm</DialogTitle>
          <DialogDescription>
            Gửi báo cáo vi phạm lên Quản trị viên.
          </DialogDescription>
        </DialogHeader>

        {/* Hình ảnh sản phẩm */}
        <div className='flex justify-center py-4'>
          <Image
            src={product.avatar}
            alt={product.name}
            width={160}
            height={160}
            className='object-cover rounded-lg shadow-md'
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className='space-y-2 text-sm'>
          <p>
            <strong>Thương hiệu:</strong> {product.brand.name}
          </p>
          <p>
            <strong>Danh mục:</strong> {product.category.name}
          </p>
          <p>
            <strong>Giá trung bình:</strong> {product.averagePrice.toLocaleString()}{' '}
            đ
          </p>
          <p>
            <strong>Đã bán:</strong> {product.sold} sản phẩm
          </p>
          <p>
            <strong>Đánh giá:</strong> {product.rating} ⭐
          </p>
        </div>

        {/* Đặc điểm nổi bật */}
        <div className='mt-4'>
          <h3 className='font-semibold'>Đặc điểm sản phẩm:</h3>
          <ul className='list-disc list-inside text-sm text-gray-700'>
            {product.features.map((feature, index) => (
              <li key={index}>
                <strong>{feature.field}:</strong> {feature.content}
              </li>
            ))}
          </ul>
        </div>

        {/* Các loại sản phẩm */}
        <div className='mt-4'>
          <h3 className='font-semibold'>Các phiên bản:</h3>
          <ul className='list-disc list-inside text-sm text-gray-700'>
            {product.types.map((type) => (
              <li key={type.typeId}>
                {type.typeName} - {type.price.toLocaleString()} đ (Còn:{' '}
                {type.stock})
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
    </Dialog>
  )
}

export default ProductDetailDialog
