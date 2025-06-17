export interface GhnProvince {
  ProvinceID: number
  ProvinceName: string
  NameExtension: string
}

export interface GhnDistrict {
  DistrictID: number
  ProvinceID: number
  DistrictName: string
}

export interface GhnWard {
  WardCode: string
  WardName: string
  DistrictID: number
}