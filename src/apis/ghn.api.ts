import envConfig from '@/config'
import http from '@/lib/http'
import { GhnDistrict, GhnProvince, GhnWard } from '@/types/entities/ghn'

export const GHN_BASE_URL = 'https://dev-online-gateway.ghn.vn'

export const getListProvincesApi = async () => {
  const response = await http.get<GhnProvince[]>(
    '/shiip/public-api/master-data/province',
    {
      headers: {
        token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API
      },
      baseUrl: GHN_BASE_URL
    }
  )
  return response.data
}

export const getListDistrictsByProvinceIdApi = async (provinceId: number) => {
  const response = await http.post<GhnDistrict[]>(
    '/shiip/public-api/master-data/district',
    { province_id: provinceId },
    {
      headers: {
        token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API
      },
      baseUrl: GHN_BASE_URL
    }
  )
  return response.data
}

export const getListWardsByDistrictIdApi = async (districtId: number) => {
  const response = await http.post<GhnWard[]>(
    '/shiip/public-api/master-data/ward?district_id',
    { district_id: districtId },
    {
      headers: { token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API },
      baseUrl: GHN_BASE_URL
    }
  )
  return response.data
}
