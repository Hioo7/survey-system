import { z } from 'zod'
import type { FieldDTO } from './form-field.types'
import { isInputField } from './form-field.types'

export function buildAnswerSchema(fields: FieldDTO[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields) {
    if (!isInputField(field)) continue

    let schema: z.ZodTypeAny

    switch (field.type) {
      case 'SHORT_TEXT':
      case 'LONG_TEXT': {
        let s = z.string().trim()
        if (field.required) s = s.min(1, `${field.label ?? 'This field'} is required`)
        if (field.validationMinLength != null)
          s = s.min(field.validationMinLength, `Minimum ${field.validationMinLength} characters`)
        if (field.validationMaxLength != null)
          s = s.max(field.validationMaxLength, `Maximum ${field.validationMaxLength} characters`)
        schema = field.required ? s : s.optional().or(z.literal(''))
        break
      }

      case 'EMAIL': {
        const s = z.string().email('Please enter a valid email address')
        schema = field.required ? s : s.optional().or(z.literal(''))
        break
      }

      case 'NUMBER': {
        const s = z.string().regex(/^\d+(\.\d+)?$/, 'Please enter a valid number')
        if (field.required) {
          schema = s.refine(
            (v) => {
              const n = parseFloat(v)
              if (field.validationMin != null && n < field.validationMin) return false
              if (field.validationMax != null && n > field.validationMax) return false
              return true
            },
            {
              message: [
                field.validationMin != null ? `Min: ${field.validationMin}` : null,
                field.validationMax != null ? `Max: ${field.validationMax}` : null,
              ]
                .filter(Boolean)
                .join(', '),
            },
          )
        } else {
          schema = s.optional().or(z.literal(''))
        }
        break
      }

      case 'PHONE': {
        const s = z
          .string()
          .regex(/^\+\d{7,15}$/, 'Use E.164 format with country code, e.g. +12025550123')
        schema = field.required ? s : s.optional().or(z.literal(''))
        break
      }

      case 'MCQ':
      case 'DROPDOWN': {
        schema = field.required
          ? z.string().min(1, `${field.label ?? 'This field'} is required`)
          : z.string().optional()
        break
      }

      case 'CHECKLIST': {
        schema = field.required
          ? z.array(z.string()).min(1, `${field.label ?? 'This field'} requires at least one selection`)
          : z.array(z.string()).optional()
        break
      }

      case 'DATE': {
        const s = z.string().date('Please enter a valid date')
        schema = field.required ? s : s.optional().or(z.literal(''))
        break
      }

      default:
        schema = z.string().optional()
    }

    shape[field.id] = schema
  }

  return z.object(shape)
}
