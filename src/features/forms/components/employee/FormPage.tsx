'use client'

import { FieldRenderer } from './FieldRenderer'
import { isInputField, isSection } from '@/features/forms/schemas/form-field.types'
import type { FieldDTO } from '@/features/forms/schemas/form-field.types'
import type { FormAnswers } from '@/features/forms/schemas/form-field.types'

type FormPageProps = {
  fields: FieldDTO[]
  answers: FormAnswers
  onChange: (fieldId: string, value: string | string[]) => void
  fieldErrors?: Record<string, string[]>
}

export function FormPage({ fields, answers, onChange, fieldErrors }: FormPageProps) {
  return (
    <div className="flex flex-col gap-5">
      {fields.map((field) => {
        if (!isInputField(field) && !isSection(field)) return null

        const value = answers[field.id] ?? (field.type === 'CHECKLIST' ? [] : '')
        const error = fieldErrors?.[field.id]?.[0]

        return (
          <FieldRenderer
            key={field.id}
            field={field}
            value={value as string | string[]}
            onChange={(v) => onChange(field.id, v)}
            error={error}
          />
        )
      })}
    </div>
  )
}
