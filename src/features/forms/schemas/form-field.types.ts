import type { FieldType } from '@/generated/prisma/enums'

export type { FieldType }

export type FieldDTO = {
  id: string
  type: FieldType
  order: number
  label: string | null
  description: string | null
  required: boolean
  placeholder: string | null
  sectionTitle: string | null
  sectionDescription: string | null
  options: string[]
  validationMinLength: number | null
  validationMaxLength: number | null
  validationMin: number | null
  validationMax: number | null
}

export type FormAnswers = Record<string, string | string[]>

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  SHORT_TEXT: 'Short Answer',
  LONG_TEXT: 'Paragraph',
  EMAIL: 'Email',
  NUMBER: 'Number',
  PHONE: 'Phone Number',
  MCQ: 'Multiple Choice',
  CHECKLIST: 'Checkboxes',
  DROPDOWN: 'Dropdown',
  DATE: 'Date',
  SECTION: 'Section Header',
  SECTION_BREAK: 'Page Break',
}

export const INPUT_FIELD_TYPES: FieldType[] = [
  'SHORT_TEXT',
  'LONG_TEXT',
  'EMAIL',
  'NUMBER',
  'PHONE',
  'MCQ',
  'CHECKLIST',
  'DROPDOWN',
  'DATE',
]

export const STRUCTURAL_FIELD_TYPES: FieldType[] = ['SECTION', 'SECTION_BREAK']

export function isInputField(f: FieldDTO): boolean {
  return !STRUCTURAL_FIELD_TYPES.includes(f.type)
}

export function isSectionBreak(f: FieldDTO): boolean {
  return f.type === 'SECTION_BREAK'
}

export function isSection(f: FieldDTO): boolean {
  return f.type === 'SECTION'
}

export function hasOptions(f: FieldDTO): boolean {
  return f.type === 'MCQ' || f.type === 'CHECKLIST' || f.type === 'DROPDOWN'
}

export function defaultFieldForType(type: FieldType, order: number): Omit<FieldDTO, 'id'> {
  return {
    type,
    order,
    label: STRUCTURAL_FIELD_TYPES.includes(type) ? null : 'Untitled Question',
    description: null,
    required: false,
    placeholder: null,
    sectionTitle: type === 'SECTION' ? 'New Section' : null,
    sectionDescription: null,
    options: hasOptions({ type } as FieldDTO) ? ['Option 1', 'Option 2'] : [],
    validationMinLength: null,
    validationMaxLength: null,
    validationMin: null,
    validationMax: null,
  }
}
