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

export interface GhnAvailableService {
  service_id: string
  short_name: string
  service_type_id: string
}

export interface GhnFee {
  total: number
  service_fee: number
  insurance_fee: number
  pick_station_fee: number
  coupon_value: number
  r2s_fee: number
  document_return: number
  double_check: number
  cod_fee: number
  pick_remote_areas_fee: number
  deliver_remote_areas_fee: number
  cod_failed_fee: number
}

export interface GhnResponse<T> {
  code: number
  message: string
  data: T
}
