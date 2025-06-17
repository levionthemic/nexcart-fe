import { RoleValue } from '@/types/enums/role'
import { Address } from './address'
import { AccountStatusValue, GenderValue } from '../enums/account'

export interface User {
  _id: string
  name: string
  username: string
  email: string
  avatar: string
  role: RoleValue
  buyerAddress?: Address[]
  gender: GenderValue
  phone?: string
  status: AccountStatusValue
}
