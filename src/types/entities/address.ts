export interface Address {
  id?: string
  provinceId: number
  districtId: number
  wardCode: string
  address: string
  isDefault?: boolean
}
