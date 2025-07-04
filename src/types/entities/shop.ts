import { ShopStatus } from "../enums/shop-status"

export interface Shop {
  id: string
  phone: string
  provinceId: number
  districtId: number
  wardCode: string
  address: string
  shortAddress: string
  status: ShopStatus
  createdAt: Date
}