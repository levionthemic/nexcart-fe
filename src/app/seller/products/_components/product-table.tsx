'use client'

import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'

import CustomTable from '@/components/custom-table/custom-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ProductListItem } from '@/types/entities/product'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

import ProductDetailDialog from './product-detail-dialog'
import RowActions from './row-actions'

const calculateAveragePrice = (product: ProductListItem) => {
  return Math.ceil(
    product.product_variants.reduce((sum, item) => item.price, 0) /
      product.product_variants.length
  )
}

const columns: ColumnDef<ProductListItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    size: 15,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false
  },
  {
    id: 'thumbnail_url',
    header: 'Ảnh',
    accessorKey: 'thumbnail_url',
    cell: ({ row }) => (
      <Image
        src={row.getValue('thumbnail_url') || DEFAULT_IMAGE_URL}
        alt=''
        width={40}
        height={40}
        className='size-10 overflow-hidden rounded-md border border-gray-300 p-0.5'
      />
    ),
    size: 35,
    enableSorting: false,
    enableResizing: false
  },
  {
    id: 'name',
    header: 'Tên sản phẩm',
    accessorKey: 'name',
    cell: ({ row }) => (
      <div className='line-clamp-4 font-medium text-wrap'>
        {row.getValue('name')}
      </div>
    )
  },
  {
    id: 'id',
    header: 'Mã SP',
    accessorKey: 'id',
    cell: ({ row }) => (
      <div className='line-clamp-4 font-medium text-wrap'>
        {row.getValue('id')}
      </div>
    ),
    size: 60,
    // filterFn: multiColumnFilterFn,
    enableSorting: true,
    enableResizing: false
  },
  {
    id: 'category_id',
    header: 'Danh mục',
    accessorFn: (row) => row.category.id,
    cell: ({ row }) => (
      <div className='line-clamp-4 text-wrap'>{row.original.category.name}</div>
    ),
    size: 100,
    enableSorting: false,
    enableResizing: false
  },
  {
    id: 'average_price',
    header: 'Giá trung bình',
    cell: ({ row }) => (
      <span className='font-bold'>
        {calculateAveragePrice(row.original).toLocaleString()}
        <sup>đ</sup>
      </span>
    ),
    size: 80,
    enableResizing: false,
    enableSorting: false
  },
  {
    id: 'sold',
    header: 'Đã bán',
    accessorKey: 'sold',
    size: 40,
    enableResizing: false
  },
  {
    id: 'is_deleted',
    header: 'Trạng thái',
    accessorKey: 'is_deleted',
    cell: ({ row }) => (
      <Badge>{row.getValue('is_deleted') ? 'Đã xóa' : 'OK'}</Badge>
    ),
    size: 40,
    enableResizing: false,
    enableSorting: false
    // filterFn: statusFilterFn
  },
  {
    id: 'actions',
    header: () => <div className='text-end'>Thao tác</div>,
    cell: ({ row }) => (
      <RowActions
        editModal={<ProductDetailDialog productProp={row.original} />}
      />
    ),
    size: 60,
    enableResizing: false,
    enableHiding: false,
    enableSorting: false
  }
]

export default function ProductTable({
  data,
  setData
}: {
  data: ProductListItem[]
  setData: React.Dispatch<React.SetStateAction<ProductListItem[]>>
}) {
  return (
    <CustomTable
      data={data}
      setData={setData}
      columns={columns}
      title='Danh sách sản phẩm'
      inputSearchPlaceholder='Lọc theo tên hoặc mã sản phẩm...'
    />
  )
}
