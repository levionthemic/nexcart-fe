'use client'

import { SearchX } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className='flex h-[80vh] flex-col items-center justify-center px-4 text-center'>
      <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-600'>
        <SearchX className='h-8 w-8' />
      </div>
      <h1 className='text-4xl font-bold text-gray-800'>
        404 - Không tìm thấy trang
      </h1>
      <p className='mt-4 max-w-md text-gray-600'>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra
        lại đường dẫn hoặc quay về trang chủ.
      </p>
      <Button onClick={() => router.push('/')} className='mt-6'>
        Về trang chủ
      </Button>
    </div>
  )
}
