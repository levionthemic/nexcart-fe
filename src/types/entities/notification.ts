import { NotificationType } from "../enums/notification-type"

export interface Notification {
  id: number
  sender_id: number
  receiver_id: number
  type: NotificationType
  content: string
  read_at: Date | null
  created_at: Date
}