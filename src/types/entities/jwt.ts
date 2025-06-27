import { RoleValue } from "../enums/role";

export interface JwtPayload {
  sub: string,
  email: string,
  role: RoleValue
}