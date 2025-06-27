import envConfig from '@/config'
import http from '@/lib/http'
import { Address } from '@/types/entities/address'
import {
  GhnDistrict,
  GhnProvince,
  GhnResponse,
  GhnWard
} from '@/types/entities/ghn'

export const getAddressString = async (addr: Address) => {
  const { province, district, ward, address } = addr

  const listProvinces = (
    await http.get<GhnResponse<GhnProvince[]>>(
      '/shiip/public-api/master-data/province',
      {
        headers: { token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API },
        baseUrl: 'https://dev-online-gateway.ghn.vn'
      }
    )
  ).payload.data

  const listDistrictsByProvince = (
    await http.post<GhnResponse<GhnDistrict[]>>(
      '/shiip/public-api/master-data/district',
      { province_id: province },
      {
        headers: { token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API },
        baseUrl: 'https://dev-online-gateway.ghn.vn'
      }
    )
  ).payload.data

  const listWardsByDistrict = (
    await http.post<GhnResponse<GhnWard[]>>(
      '/shiip/public-api/master-data/ward?district_id',
      { district_id: district },
      {
        headers: {
          token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API,
          'Content-Type': 'application/json'
        },
        baseUrl: 'https://dev-online-gateway.ghn.vn'
      }
    )
  ).payload.data

  const provinceName = listProvinces.find(
    (p) => p.ProvinceID === province
  )?.ProvinceName
  const districtName = listDistrictsByProvince.find(
    (d) => d.DistrictID === district
  )?.DistrictName
  const wardName = listWardsByDistrict.find(
    (w) => w.WardCode === ward
  )?.WardName

  return `${address}, ${wardName}, ${districtName}, ${provinceName}`
}
