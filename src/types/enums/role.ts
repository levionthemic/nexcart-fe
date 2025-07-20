export enum Role {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export type RoleValue = (typeof Role)[keyof typeof Role]