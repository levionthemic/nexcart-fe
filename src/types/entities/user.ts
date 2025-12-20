import { Role } from '@/types/enums/role'

import { AccountStatusValue } from '../enums/account'

import { Address } from './address'

export interface User {
  user_id: string
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
  name: string
  addresses: Address[]
}

export interface Buyer extends BuyerMinimal {
  user: User
}

export interface SellerMinimal {
  seller_id: string

  name: string
  address: string
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
