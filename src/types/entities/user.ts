import { RoleValue } from '@/types/enums/role'

export interface User {
  _id: string
  name: string
  username: string
  email: string
  avatar: string
  role: RoleValue
  buyerAddress?: [
    {
      address: string
      ward: string
      district: number
      province: number
    }
  ]
  gender: 'male' | 'female'
  phone?: string
  status: 'active' | 'inactive'
}
