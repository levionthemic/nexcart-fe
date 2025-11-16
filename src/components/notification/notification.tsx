/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { BellRing, MoreHorizontalIcon } from 'lucide-react'
import {
  fetchCurrentNotificationListAPI,
  selectCurrentNotificationList,
  selectHasNewNotification,
  setHasNewNotification
} from '@/redux/notification/notificationSlice'
import { AppDispatch } from '@/redux/store'
import { toast } from 'sonner'
import { NotificationType } from '@/types/enums/notification-type'
import { ScrollArea } from '../ui/scroll-area'
import { format } from 'date-fns'
import {
  categorizeDate,
  mapNotificationTypeToTitle,
  mapNotificationTypeToToastInfo
} from '@/utils/helpers'
import { useSocketContext } from '../providers/socket-provider'
import { Button } from '../ui/button'

export type SocketPayload = {
  content: string
  userId: string
  type: NotificationType
}

export default function Notification() {
  const hasNewNotification = useSelector(selectHasNewNotification)
  const currentNotificationList = useSelector(selectCurrentNotificationList)
  const dispatch = useDispatch<AppDispatch>()
  const { notificationSocket } = useSocketContext()

  const MAP_DATE_TYPE = ['Hôm nay', 'Hôm qua', 'Trước đó']

  // Có 1 bug trong component này là nó được sử dụng trong header chung và header của user, nên khi chuyển sang giao diện user
  // thì socket bị disconnect và không tự connect lại được
  // Có thể cần làm sao để socket được khởi tạo và disconnect ở 1 nơi cao hơn, ví dụ như trong _app.tsx

  useEffect(() => {
    if (notificationSocket) {
      notificationSocket.on(
        'server:newNotification',
        (payload: SocketPayload) => {
          dispatch(setHasNewNotification(true))
          dispatch(fetchCurrentNotificationListAPI())
          toast.info(mapNotificationTypeToToastInfo(payload.type), {
            position: 'top-center',
            richColors: true
          })
        }
      )

      // socket.on('connect_error', (err) => {
      //   console.error('Socket connection error:', err.message)
      // })

      return () => {
        notificationSocket.off('server:newNotification')
        notificationSocket.off('connect_error')
      }
    }
  }, [notificationSocket])

  const handleUnshowBadge = () => {
    dispatch(setHasNewNotification(false))
  }

  const filterNotificationsByDate = (dateType = 0) => {
    return currentNotificationList?.filter(
      (notification) => categorizeDate(notification.created_at) === dateType
    )
  }

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className='relative cursor-pointer hover:scale-105 hover:ease-out hover:duration-300 transition-all'
          onClick={handleUnshowBadge}
        >
          <BellRing className='text-mainColor1-600 text-xl' />
          {hasNewNotification && (
            <div className='w-2.5 h-2.5 rounded-full text-center absolute -top-2 -right-2 bg-mainColor2-800'></div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-96'>
        <ScrollArea className='max-h-[90vh]'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='text-2xl font-bold'>Thông báo</div>
              <MoreHorizontalIcon />
            </div>
            <div className='space-y-8'>
              {MAP_DATE_TYPE.map((key, index) => (
                <div key={key} className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>{key}</div>
                    {index === 0 && (
                      <Button variant='link' className=''>
                        Xem tất cả
                      </Button>
                    )}
                  </div>
                  <div className='space-y-4'>
                    {!currentNotificationList ||
                    currentNotificationList.length === 0 ||
                    !filterNotificationsByDate(index) ||
                    filterNotificationsByDate(index)?.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>
                        Không có thông báo mới.
                      </p>
                    ) : (
                      filterNotificationsByDate(index)?.map((notification) => (
                        <div
                          key={notification.id}
                          className='rounded-lg p-3 transition hover:bg-mainColor1-100/50 flex items-center gap-6 bg-mainColor1-100/20 cursor-pointer'
                        >
                          {!notification.read_at && (
                            <div className='size-2.5 bg-mainColor1-800 rounded-full relative -top-10'></div>
                          )}
                          <div className='flex-1'>
                            <h4 className='font-semibold text-base mb-2'>
                              {mapNotificationTypeToTitle(notification.type)}
                            </h4>

                            <p className='text-sm'>{notification.content}</p>
                            <p className='text-xs text-right text-gray-500 italic'>
                              {format(
                                notification.created_at,
                                "'Lúc' k:m:ss 'ngày' dd/MM/yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button className='w-full mt-4 bg-gray-600'>
              Xem các thông báo trước
            </Button>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
