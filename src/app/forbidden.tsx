'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

export default function Forbidden() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold text-red-600">403 - Không có quyền truy cập</h1>
      <p className="mt-4 text-gray-600 max-w-md">
        Bạn không được phép truy cập vào trang này. Vui lòng kiểm tra lại quyền hoặc liên hệ quản trị viên nếu cần thiết.
      </p>
      <Button onClick={() => router.back()} className="mt-6">
        Quay lại trang trước
      </Button>
    </div>
  )
}
