import z from 'zod'

import { Role } from '@/types/enums/role'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '@/utils/validators'

export const LoginFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: FIELD_REQUIRED_MESSAGE })
      .regex(EMAIL_RULE, { message: EMAIL_RULE_MESSAGE }),
    password: z
      .string()
      .min(1, { message: FIELD_REQUIRED_MESSAGE })
      .regex(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE }),
    role: z.nativeEnum(Role)
  })
  .strict()
export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>

export const RegisterFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: FIELD_REQUIRED_MESSAGE })
      .regex(EMAIL_RULE, { message: EMAIL_RULE_MESSAGE }),
    password: z
      .string()
      .min(1, { message: FIELD_REQUIRED_MESSAGE })
      .regex(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE }),
    confirmPassword: z
      .string()
      .min(1, { message: FIELD_REQUIRED_MESSAGE })
      .regex(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE }),
    role: z.nativeEnum(Role)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })
export type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>

export const ForgotPasswordFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: FIELD_REQUIRED_MESSAGE })
      .regex(EMAIL_RULE, { message: EMAIL_RULE_MESSAGE })
  })
  .strict()
export type ForgotPasswordFormSchemaType = z.infer<
  typeof ForgotPasswordFormSchema
>

export const ResetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: FIELD_REQUIRED_MESSAGE })
      .regex(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE }),
    confirmPassword: z
      .string()
      .min(1, { message: FIELD_REQUIRED_MESSAGE })
      .regex(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE })
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })
export type ResetPasswordFormSchemaType = z.infer<
  typeof ResetPasswordFormSchema
>
