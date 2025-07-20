export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  DEACTIVATED = 'DEACTIVATED'
}
export type AccountStatusValue =
  (typeof AccountStatus)[keyof typeof AccountStatus]

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}
export type GenderValue = (typeof Gender)[keyof typeof Gender]
