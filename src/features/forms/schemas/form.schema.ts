import { z } from 'zod'

export const createFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).default(''),
})

export const updateFormDraftSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).default(''),
  fields: z.string().min(1, 'Fields are required'),
})

export const deleteFormSchema = z.object({
  id: z.string().min(1),
})

export const publishFormSchema = z.object({
  id: z.string().min(1),
})

export const assignEmployeesSchema = z.object({
  formId: z.string().min(1),
  employeeIds: z.string(),
})

export type CreateFormInput = z.infer<typeof createFormSchema>
export type UpdateFormDraftInput = z.infer<typeof updateFormDraftSchema>
