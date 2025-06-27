'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 mb-6">
        <SearchX className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800">404 - Không tìm thấy trang</h1>
      <p className="mt-4 text-gray-600 max-w-md">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
      </p>
      <Button onClick={() => router.push('/')} className="mt-6">
        Về trang chủ
      </Button>
    </div>
  )
}
