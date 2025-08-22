import { Role } from '@/types/enums/role'
import { Address } from './address'
import { AccountStatusValue } from '../enums/account'

export interface User {
  user_id: string
  name: string
  email: string
  avatar: string
  role: Role
  phone?: string
  status: AccountStatusValue
  created_at: Date
  updated_at: Date
  buyer?: BuyerMinimal
  seller?: SellerMinimal
}

export interface BuyerMinimal {
  buyer_id: string
  addresses: Address[]
}

export interface Buyer extends BuyerMinimal {
  user: User
}

export interface SellerMinimal {
  seller_id: string

  cover_photo: string | null
  foundedDate: Date | null
  description: string | null
  facebook_link: string | null
  instagram_link: string | null
  twitter_link: string | null
}

export interface Seller extends SellerMinimal {
  user: User
}
