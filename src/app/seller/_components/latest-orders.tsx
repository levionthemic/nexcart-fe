'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Order } from '@/types/entities/order'
import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { OrderStatus } from '@/types/enums/order-status'
import dayjs from 'dayjs'
import { getOrdersApi } from '@/apis/order.api'

export default function LatestOrders() {
  const [latestOrders, setLatestOrders] = useState<Order[]>([])
  useEffect(() => {
    getOrdersApi().then((data) => setLatestOrders(data || []))
  }, [])
  return (
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-transparent'>
          <TableHead>Mã đơn hàng</TableHead>
          <TableHead>Ngày đặt</TableHead>
          <TableHead>Tên khách hàng</TableHead>
          <TableHead>Thành tiền</TableHead>
          <TableHead className='text-right'>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {latestOrders.map((item) => (
          <TableRow key={item.order_code}>
            <TableCell>
              <div>{item.order_code}</div>
            </TableCell>
            <TableCell>{dayjs(item.created_at).format('DD/MM/YYYY')}</TableCell>
            <TableCell>{item.buyer.name}</TableCell>
            <TableCell className='font-bold text-red-500'>
              {item.final_price.toLocaleString('vi-vn')}
              <sup>đ</sup>
            </TableCell>
            <TableCell className='text-right'>
              <Badge
                className={cn(
                  item.status === OrderStatus.CANCELLED &&
                    'bg-muted-foreground/60 text-primary-foreground',
                  item.status === OrderStatus.PENDING && 'bg-red-500',
                  item.status === OrderStatus.SHIPPING && 'bg-amber-400',
                  item.status === OrderStatus.SUCCESS && 'bg-green-600',
                  item.status === OrderStatus.FAIL && 'bg-gray-600'
                )}
              >
                {item.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
