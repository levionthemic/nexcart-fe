/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { format } from 'date-fns'
import { BellRing, MoreHorizontalIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  fetchCurrentNotificationListAPI,
  selectCurrentNotificationList,
  selectHasNewNotification,
  setHasNewNotification
} from '@/redux/notification/notificationSlice'
import { AppDispatch } from '@/redux/store'
import { NotificationType } from '@/types/enums/notification-type'
import {
  categorizeDate,
  mapNotificationTypeToTitle,
  mapNotificationTypeToToastInfo
} from '@/utils/helpers'

import { useSocketContext } from '../providers/socket-provider'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'

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
          className='relative cursor-pointer transition-all hover:scale-105 hover:duration-300 hover:ease-out'
          onClick={handleUnshowBadge}
        >
          <BellRing className='text-mainColor1-600 text-xl' />
          {hasNewNotification && (
            <div className='bg-mainColor2-800 absolute -top-2 -right-2 h-2.5 w-2.5 rounded-full text-center'></div>
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
                      <p className='text-muted-foreground text-sm'>
                        Không có thông báo mới.
                      </p>
                    ) : (
                      filterNotificationsByDate(index)?.map((notification) => (
                        <div
                          key={notification.id}
                          className='hover:bg-mainColor1-100/50 bg-mainColor1-100/20 flex cursor-pointer items-center gap-6 rounded-lg p-3 transition'
                        >
                          {!notification.read_at && (
                            <div className='bg-mainColor1-800 relative -top-10 size-2.5 rounded-full'></div>
                          )}
                          <div className='flex-1'>
                            <h4 className='mb-2 text-base font-semibold'>
                              {mapNotificationTypeToTitle(notification.type)}
                            </h4>

                            <p className='text-sm'>{notification.content}</p>
                            <p className='text-right text-xs text-gray-500 italic'>
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

            <Button className='mt-4 w-full bg-gray-600'>
              Xem các thông báo trước
            </Button>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
