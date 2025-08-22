export interface Address {
  id?: number
  province_id: number
  district_id: number
  ward_code: string
  address: string
  is_default?: boolean
}
