import envConfig from '@/config'
import http from '@/lib/http'
import { Address } from '@/types/entities/address'
import { GhnDistrict, GhnProvince, GhnWard } from '@/types/entities/ghn'

export const getAddressString = async (addr: Address) => {
  const { province, district, ward, address } = addr

  const listProvinces = (await http.get<GhnProvince[]>(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
    { headers: { token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API } }
  )).payload

  const listDistrictsByProvince = (await http.post<GhnDistrict[]>(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
    JSON.stringify({
      province_id: province
    }),
    {
      headers: {
        token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API,
        'Content-Type': 'application/json'
      }
    }
  )).payload

  const listWardsByDistrict = (await http.post<GhnWard[]>(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id',
    JSON.stringify({
      district_id: district
    }),
    {
      headers: {
        token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API,
        'Content-Type': 'application/json'
      }
    }
  )).payload

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
