import {
  getListDistrictsByProvinceIdApi,
  getListProvincesApi,
  getListWardsByDistrictIdApi
} from '@/apis/ghn.api'
import { Address } from '@/types/entities/address'

export const getAddressString = async (addr: Address) => {
  const { provinceId, districtId, wardCode, address } = addr

  const listProvinces = await getListProvincesApi()
  const listDistrictsByProvinceId = await getListDistrictsByProvinceIdApi(
    provinceId
  )
  const listWardsByDistrictId = await getListWardsByDistrictIdApi(districtId)

  const provinceName = listProvinces?.find(
    (p) => p.ProvinceID === provinceId
  )?.ProvinceName
  const districtName = listDistrictsByProvinceId?.find(
    (d) => d.DistrictID === districtId
  )?.DistrictName
  const wardName = listWardsByDistrictId?.find(
    (w) => w.WardCode === wardCode
  )?.WardName

  return `${address}, ${wardName}, ${districtName}, ${provinceName}`
}
