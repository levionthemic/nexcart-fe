export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
export type AccountStatusValue = (typeof AccountStatus)[keyof typeof AccountStatus]

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}
export type GenderValue = (typeof Gender)[keyof typeof Gender]