export enum Role {
  Buyer = 'BUYER',
  Seller = 'SELLER',
  Admin = 'ADMIN'
}

export type RoleValue = (typeof Role)[keyof typeof Role]