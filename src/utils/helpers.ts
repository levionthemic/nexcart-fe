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

export function generateSKU(): string {
  // Lấy 12 số đầu ngẫu nhiên
  const base = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10).toString()
  ).join('')

  // Tính số kiểm tra (check digit) theo chuẩn EAN-13
  const digits = base.split('').map(Number)
  const sum = digits.reduce((acc, d, i) => acc + (i % 2 === 0 ? d : d * 3), 0)

  const checkDigit = (10 - (sum % 10)) % 10

  return base + checkDigit.toString()
}

export function objectToFormData(obj: Record<string, string | Date | File>): FormData {
  const formData = new FormData();
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      formData.append(key, obj[key] instanceof Date ? obj[key].toISOString() : obj[key]);
    }
  }
  return formData;
}

