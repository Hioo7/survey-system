import { z } from 'zod'

export const createEditRequestSchema = z.object({
  formId: z.string().min(1, 'Please select a form'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be under 1000 characters'),
})

export const closeEditRequestSchema = z.object({
  id: z.string().min(1),
})
