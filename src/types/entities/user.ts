import { Role } from '@/types/enums/role'
import { Address } from './address'
import { AccountStatusValue, GenderValue } from '../enums/account'

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  dateOfBirth: Date
  role: Role
  gender: GenderValue
  phone?: string
  status: AccountStatusValue
  createdAt: Date
  updatedAt: Date
  buyer?: BuyerMinimal
  seller?: SellerMinimal
}

export interface BuyerMinimal {
  id: string
  addresses: Address[]
}

export interface Buyer extends BuyerMinimal {
  user: User
}

export interface SellerMinimal {
  id: string

  coverPhoto: string | null
  foundedDate: Date | null
  shortDescription: string | null
  description: string | null
  facebookLink: string | null
  instagramLink: string | null
  twitterLink: string | null
}

export interface Seller extends SellerMinimal {
  user: User
}
