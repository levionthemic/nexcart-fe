'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

import { useSocketContext } from '@/components/providers/socket-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { clearCart } from '@/redux/cart/cartSlice'
import { AppDispatch } from '@/redux/store'
import { logoutUserAction } from '@/redux/user/userSlice'

export default function LogoutComponent({ icon }: { icon: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { notificationSocket, setNotificationSocket } = useSocketContext()

  const handleLogout = async () => {
    notificationSocket?.off('connect')
    setNotificationSocket(null)

    dispatch(clearCart())

    toast.promise(dispatch(logoutUserAction()).unwrap(), {
      loading: 'Đang đăng xuất...',
      success: () => {
        router.refresh()
        return 'Đăng xuất thành công'
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{icon}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn đăng xuất?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn sẽ cần phải đăng nhập lại trước khi truy cập vào hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>
            Đăng xuất
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
