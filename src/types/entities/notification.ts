import { NotificationType } from '../enums/notification-type'

export interface Notification {
  id: number
  senderId: number
  receiverId: number
  type: NotificationType
  content: string
  readAt: Date | null
  createdAt: Date
}
