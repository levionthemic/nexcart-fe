export interface Address {
  id?: number
  provinceId: number
  districtId: number
  wardCode: string
  address: string
  isDefault?: boolean
}
