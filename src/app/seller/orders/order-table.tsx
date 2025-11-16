'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef, Row } from '@tanstack/react-table'

import { Dispatch, SetStateAction } from 'react'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import Image from 'next/image'
import { Order } from '@/types/entities/order'
import { DEFAULT_IMAGE_URL, MAP_ORDER_STATUS } from '@/utils/constants'
import { OrderStatus } from '@/types/enums/order-status'
import { getOrdersApi, updateOrderStatusApi } from '@/apis/order.api'

import RowActions from './row-actions'

import CustomTable from '@/components/custom-table/custom-table'

// Custom filter function for multi-column searching
const multiColumnFilterFn = (
  row: Row<Order>,
  columnId: string,
  filterValue: string
) => {
  const searchableRowContent =
    `${row.original.buyer.name} ${row.original.buyer.user.email}`.toLowerCase()
  const searchTerm = (filterValue ?? '').toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

const statusFilterFn = (
  row: Row<Order>,
  columnId: string,
  filterValue: string
) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}

interface OrderTableProps {
  data: Order[]
  setData: Dispatch<SetStateAction<Order[]>>
}

export default function OrderTable({ data, setData }: OrderTableProps) {
  const handleConfirmOrder = (row: Row<Order>) => {
    const data = {
      orderId: row.original.order_code,
      status: OrderStatus.SHIPPING
    }
    toast.promise(updateOrderStatusApi(data), {
      loading: 'Đang cập nhật...',
      success: () => {
        getOrdersApi().then((data) => {
          if (data) setData(data)
        })
        return 'Cập nhật thành công!'
      },
      error: 'Đã có lỗi!'
    })
  }

  const columns: ColumnDef<Order>[] = [
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
      size: 28,
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'order_code',
      header: 'Mã đơn hàng',
      accessorKey: 'order_code',
      cell: ({ row }) => (
        <div className='text-ellipsis overflow-hidden'>
          {row.getValue('order_code')}
        </div>
      )
    },
    {
      id: 'created_at',
      header: 'Ngày đặt hàng',
      accessorKey: 'created_at',
      cell: ({ row }) => (
        <div className='text-ellipsis overflow-hidden'>
          {dayjs(row.getValue('created_at')).format('DD-MM-YYYY')}
        </div>
      ),
      size: 110,
      enableResizing: false
    },
    {
      id: 'buyer_name',
      header: 'Người đặt',
      accessorFn: (row) => row.buyer.name,
      cell: ({ row }) => (
        <div className='font-medium'>{row.original.buyer.name}</div>
      ),
      size: 120,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
      enableResizing: false
    },
    {
      id: 'shop_id',
      header: 'Mã cửa hàng',
      accessorFn: (row) => row.shop.id,
      cell: ({ row }) => (
        <div className='text-ellipsis overflow-hidden'>
          {row.getValue('shop_id')}
        </div>
      ),
      size: 100,
      enableResizing: false
    },
    {
      id: 'order_items',
      header: 'Danh sách sản phẩm',
      accessorKey: 'order_items',
      size: 300,
      cell: ({ row }) => (
        <div>
          {row.original.order_items.slice(0, 2).map((item, index) => (
            <div
              key={Math.random()}
              className={`flex items-center gap-2 ${
                index != row.original.order_items.length - 1 && 'mb-2'
              }`}
            >
              <div>
                <Image
                  src={item.product_variant.image_url || DEFAULT_IMAGE_URL}
                  alt=''
                  width={40}
                  height={40}
                  className='rounded-md border border-gray-300 p-0.5 size-10'
                />
              </div>
              <div className='flex-1 text-ellipsis overflow-hidden'>
                <div className='line-clamp-1'>{item.product_variant.name}</div>
                <div className='line-clamp-1 text-xs text-muted-foreground'>
                  Loại: {item.product_variant.name}
                </div>
              </div>
            </div>
          ))}
          {row.original.order_items.length > 2 && (
            <div className='mt-2 text-muted-foreground'>
              + {row.original.order_items.length - 2} sản phẩm
            </div>
          )}
        </div>
      )
    },
    {
      id: 'totalPrice',
      header: 'Tổng tiền',
      cell: ({ row }) => {
        return (
          <div className='font-bold text-red-500'>
            {row.original.final_price.toLocaleString('vi-vn')}
            <sup>đ</sup>
          </div>
        )
      },
      size: 70,
      enableResizing: false
    },
    {
      id: 'status',
      header: () => <div className='text-center w-full'>Trạng thái</div>,
      accessorKey: 'status',
      cell: ({ row }) => (
        <div className='flex items-center justify-center'>
          <Badge
            className={cn(
              row.getValue('status') === OrderStatus.CANCELLED &&
                'bg-muted-foreground/60 text-primary-foreground',
              row.getValue('status') === OrderStatus.PENDING && 'bg-red-500',
              row.getValue('status') === OrderStatus.SHIPPING && 'bg-amber-400',
              row.getValue('status') === OrderStatus.SUCCESS && 'bg-green-600',
              row.getValue('status') === OrderStatus.FAIL && 'bg-gray-600'
            )}
          >
            {MAP_ORDER_STATUS[row.original.status]}
          </Badge>
        </div>
      ),
      size: 100,
      filterFn: statusFilterFn,
      enableResizing: false
    },
    {
      id: 'actions',
      header: () => <div className='text-center w-full'>Thao tác</div>,
      cell: ({ row }) => (
        <RowActions row={row} handleConfirmOrder={handleConfirmOrder} />
      ),
      size: 80,
      enableHiding: false,
      enableResizing: false
    }
  ]

  return (
    <CustomTable
      data={data}
      setData={setData}
      columns={columns}
      title='Danh sách đơn hàng'
      inputSearchPlaceholder='Lọc theo mã đơn hàng...'
    />
  )
}
