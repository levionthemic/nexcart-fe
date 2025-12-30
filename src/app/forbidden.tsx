'use client'

import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function Forbidden() {
  const router = useRouter()

  return (
    <div className='flex h-[80vh] flex-col items-center justify-center px-4 text-center'>
      <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600'>
        <AlertTriangle className='h-8 w-8' />
      </div>
      <h1 className='text-4xl font-bold text-red-600'>
        403 - Không có quyền truy cập
      </h1>
      <p className='mt-4 max-w-md text-gray-600'>
        Bạn không được phép truy cập vào trang này. Vui lòng kiểm tra lại quyền
        hoặc liên hệ quản trị viên nếu cần thiết.
      </p>
      <Button onClick={() => router.back()} className='mt-6'>
        Quay lại trang trước
      </Button>
    </div>
  )
}
