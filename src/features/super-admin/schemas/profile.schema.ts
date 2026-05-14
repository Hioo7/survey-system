import { z } from 'zod'

export const updateEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type UpdateEmailInput = z.infer<typeof updateEmailSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
