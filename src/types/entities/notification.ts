import { NotificationType } from "../enums/notification-type"

export interface Notification {
  id: string
  notifierId: string
  notifieeId: string
  type: NotificationType
  content: string
  readAt: Date | null
  createdAt: Date
}