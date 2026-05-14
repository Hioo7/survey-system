import { z } from 'zod'

export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
})

export const updateEmployeeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
})

export const deleteEmployeeSchema = z.object({
  id: z.string().min(1),
})

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>
export type DeleteEmployeeInput = z.infer<typeof deleteEmployeeSchema>
