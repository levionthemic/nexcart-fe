import { Role } from '@/types/enums/role'

import { AccountStatusValue } from '../enums/account'

import { Address } from './address'

export interface User {
  id: string
  email: string
  avatar: string
  role: Role
  phone?: string
  status: AccountStatusValue
  createdAt: Date
  updatedAt: Date
  buyer?: BuyerMinimal
  seller?: SellerMinimal
}

export interface BuyerMinimal {
  id: string
  name: string
  addresses: Address[]
}

export interface Buyer extends BuyerMinimal {
  user: User
}

export interface SellerMinimal {
  id: string

  name: string
  address: string
  cover_photo: string | null
  foundedDate: Date | null
  description: string | null
  facebookLink: string | null
  instagramLink: string | null
  twitterLink: string | null
}

export interface Seller extends SellerMinimal {
  user: User
}
