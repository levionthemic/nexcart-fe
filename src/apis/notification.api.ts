import http from '@/lib/http'
import { Notification } from '@/types/entities/notification'

export const NOTIFICATION_API_PREFIX = 'notifications'

export const getNotificationListApi = async () => {
  const response = await http.get<Notification[]>(NOTIFICATION_API_PREFIX, {
    credentials: 'include'
  })
  return response.data
}
