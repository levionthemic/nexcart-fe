'use client'

import dayjs from 'dayjs'
import { Package, CalendarDays, MapPinned, PhoneCallIcon } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShopStatus } from '@/types/enums/shop-status'

const statusColor = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-700',
  PENDING: 'bg-yellow-100 text-yellow-700'
}

interface StoreCardProps {
  shortAddress: string
  phone: string
  status: ShopStatus
  logoUrl: string | StaticImageData
  name: string
  createdAt: Date
  productCount: number
  onView: () => void
  onEdit: () => void
}

export default function StoreCard({
  shortAddress,
  phone,
  logoUrl,
  name,
  status,
  createdAt,
  productCount,
  onView,
  onEdit
}: StoreCardProps) {
  return (
    <Card className='rounded-2xl shadow-md transition hover:shadow-lg'>
      <CardContent className='flex flex-col gap-4 p-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Image
              src={logoUrl}
              alt={name}
              width={48}
              height={48}
              className='aspect-square h-full w-full rounded-lg border object-cover'
            />
            <div>
              <h2 className='mb-1 text-lg font-semibold'>{name}</h2>
              <p className='text-muted-foreground flex items-center gap-2 text-sm'>
                <CalendarDays className='h-4 w-4' />
                <span className='leading-0'>
                  {dayjs(createdAt).format('DD/MM/YYYY')}
                </span>
              </p>
            </div>
          </div>

          <Badge className={statusColor[status]}>
            {status === ShopStatus.ACTIVE
              ? 'Đang hoạt động'
              : status === ShopStatus.INACTIVE
                ? 'Tạm dừng'
                : 'Chờ duyệt'}
          </Badge>
        </div>

        {/* Info */}
        <div className='text-muted-foreground flex items-center gap-2 px-1 text-sm'>
          <MapPinned size={16} className='w-4' />
          <div>{shortAddress}</div>
        </div>

        <div className='text-muted-foreground flex items-center justify-between px-1 text-sm'>
          <div className='flex items-center gap-2'>
            <Package className='h-4 w-4' />
            <span>{productCount} sản phẩm</span>
          </div>
          <div className='flex items-center gap-2'>
            <PhoneCallIcon size={16} className='w-4' />
            <div>{phone}</div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex justify-end gap-2'>
          <Button variant='outline' size='sm' onClick={onEdit}>
            Chỉnh sửa
          </Button>
          <Button size='sm' onClick={onView}>
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
