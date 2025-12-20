import { ShopStatus } from '../enums/shop-status'

import { Address } from './address'

export interface Shop {
  id: number
  phone: string
  address: Address
  shortAddress: string
  status: ShopStatus
  created_at: Date
}
