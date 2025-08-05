import { OrderStatus } from "@/types/enums/order-status"

export const API_ROOT = 'http://localhost:4000'
export const NEXT_SERVER_ROOT = 'http://localhost:3000'

export const DEFAULT_ITEMS_PER_PAGE = 40
export const DEFAULT_PAGE = 1

export const COMMENTS = [
  'Rất không hài lòng',
  'Không hài lòng',
  'Bình thường',
  'Hài lòng',
  'Cực kì hài lòng'
]

export const MAP_ORDER_STATUS = {
  [OrderStatus.PENDING]: 'Đang xử lý',
  [OrderStatus.SHIPPING]: 'Đang vận chuyển',
  [OrderStatus.SUCCESS]: 'Đã giao',
  [OrderStatus.CANCELLED]: 'Đã hủy',
  [OrderStatus.FAIL]: 'Giao thất bại'
}

export const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/dnzytzmek/image/upload/v1752140613/empty_c2urfw.jpg"