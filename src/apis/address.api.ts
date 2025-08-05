import { AddAddressFormSchemaType } from '@/app/user/_components/add-address'
import http from '@/lib/http'
import { Address } from '@/types/entities/address'

export const ADDRESS_API_PREFIX = '/addresses'

export const createAddressApi = async (data: AddAddressFormSchemaType) => {
  const response = await http.post<Address[]>(
    `${ADDRESS_API_PREFIX}/create`,
    data,
    { credentials: 'include' }
  )
  return response.data
}
