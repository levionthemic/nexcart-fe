import {
  getListDistrictsByProvinceIdApi,
  getListProvincesApi,
  getListWardsByDistrictIdApi
} from '@/apis/ghn.api'
import { Address } from '@/types/entities/address'
import { NotificationType } from '@/types/enums/notification-type'

export const getAddressString = async (addr: Address) => {
  const { province_id, district_id, ward_code, address } = addr

  const listProvinces = await getListProvincesApi()
  const listDistrictsByProvinceId = await getListDistrictsByProvinceIdApi(
    province_id
  )
  const listWardsByDistrictId = await getListWardsByDistrictIdApi(district_id)

  const provinceName = listProvinces?.find(
    (p) => p.ProvinceID === province_id
  )?.ProvinceName
  const districtName = listDistrictsByProvinceId?.find(
    (d) => d.DistrictID === district_id
  )?.DistrictName
  const wardName = listWardsByDistrictId?.find(
    (w) => w.WardCode === ward_code
  )?.WardName

  return `${address}, ${wardName}, ${districtName}, ${provinceName}`
}

export const mapNotificationTypeToToastInfo = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ORDER_STATUS_UPDATE:
      return 'Đơn hàng của bạn có cập nhật mới!'

    default:
      break
  }
}

export const mapNotificationTypeToTitle = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ORDER_STATUS_UPDATE:
      return 'Cập nhật trạng thái đơn hàng'
  
    default:
      break;
  }
}

export const normalizeDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const categorizeDate = (inputDate: Date) => {
  const today = normalizeDate(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const input = normalizeDate(new Date(inputDate));

  if (input.getTime() === today.getTime()) {
    return 0;
  } else if (input.getTime() === yesterday.getTime()) {
    return 1;
  } else if (input < yesterday) {
    return 2;
  } else {
    return 3;
  }
}

