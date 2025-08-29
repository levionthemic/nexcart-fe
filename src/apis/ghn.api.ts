import envConfig from '@/config'
import http from '@/lib/http'
import {
  GhnAvailableService,
  GhnDistrict,
  GhnFee,
  GhnProvince,
  GhnWard
} from '@/types/entities/ghn'

export const GHN_BASE_URL = 'https://dev-online-gateway.ghn.vn'

export const getListProvincesApi = async () => {
  const response = await http.get<GhnProvince[]>(
    '/shiip/public-api/master-data/province',
    {
      headers: {
        token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API
      },
      baseUrl: GHN_BASE_URL,
      credentials: 'same-origin'
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
      baseUrl: GHN_BASE_URL,
      credentials: 'omit'
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
      baseUrl: GHN_BASE_URL,
      credentials: 'omit'
    }
  )
  return response.data
}

export const getAvailableServicesApi = async (data: Record<string, number>) => {
  const response = await http.post<GhnAvailableService[]>(
    '/shiip/public-api/v2/shipping-order/available-services',
    {
      from_district: data.fromDistrictId,
      to_district: data.toDistrictId,
      shop_id: Number(envConfig.NEXT_PUBLIC_GHN_SHOP_ID)
    },
    {
      headers: { token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API },
      baseUrl: GHN_BASE_URL,
      credentials: 'omit'
    }
  )
  return response.data
}

export const getFeeApi = async (data: Record<string, unknown>) => {
  const response = await http.post<GhnFee>(
    '/shiip/public-api/v2/shipping-order/fee',
    data,
    {
      headers: {
        token: envConfig.NEXT_PUBLIC_GHN_TOKEN_API,
        'Content-Type': 'application/json',
        shop_id: envConfig.NEXT_PUBLIC_GHN_SHOP_ID
      },
      baseUrl: GHN_BASE_URL,
      credentials: 'omit'
    }
  )
  return response.data
}
