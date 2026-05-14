import { db } from '@/lib/db'
import type { FieldDTO } from '../schemas/form-field.types'

export type FormDTO = {
  id: string
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: string
  updatedAt: string
  fields: FieldDTO[]
  _count: {
    assignments: number
    versions: number
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapField(f: any): FieldDTO {
  return {
    id: f.id,
    type: f.type,
    order: f.order,
    label: f.label,
    description: f.description,
    required: f.required,
    placeholder: f.placeholder,
    sectionTitle: f.sectionTitle,
    sectionDescription: f.sectionDescription,
    options: f.options,
    validationMinLength: f.validationMinLength,
    validationMaxLength: f.validationMaxLength,
    validationMin: f.validationMin,
    validationMax: f.validationMax,
  }
}

export async function getAllForms(): Promise<FormDTO[]> {
  const forms = await db.form.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { assignments: true, versions: true } },
      fields: { orderBy: { order: 'asc' } },
    },
  })

  return forms.map((f) => ({
    id: f.id,
    title: f.title,
    description: f.description,
    status: f.status,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
    fields: f.fields.map(mapField),
    _count: f._count,
  }))
}

export async function getFormById(id: string): Promise<FormDTO | null> {
  const f = await db.form.findUnique({
    where: { id },
    include: {
      _count: { select: { assignments: true, versions: true } },
      fields: { orderBy: { order: 'asc' } },
    },
  })
  if (!f) return null

  return {
    id: f.id,
    title: f.title,
    description: f.description,
    status: f.status,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
    fields: f.fields.map(mapField),
    _count: f._count,
  }
}

export async function createForm(data: {
  title: string
  description: string
}): Promise<{ id: string }> {
  const f = await db.form.create({ data })
  return { id: f.id }
}

export async function updateFormDraft(
  id: string,
  data: {
    title: string
    description: string
    fields: FieldDTO[]
  },
): Promise<void> {
  await db.$transaction([
    db.form.update({
      where: { id },
      data: { title: data.title, description: data.description },
    }),
    db.formField.deleteMany({ where: { formId: id } }),
    ...(data.fields.length > 0
      ? [
          db.formField.createMany({
            data: data.fields.map((f) => ({
              formId: id,
              type: f.type,
              order: f.order,
              label: f.label,
              description: f.description,
              required: f.required,
              placeholder: f.placeholder,
              sectionTitle: f.sectionTitle,
              sectionDescription: f.sectionDescription,
              options: f.options,
              validationMinLength: f.validationMinLength,
              validationMaxLength: f.validationMaxLength,
              validationMin: f.validationMin,
              validationMax: f.validationMax,
            })),
          }),
        ]
      : []),
  ])
}

export async function deleteForm(id: string): Promise<void> {
  await db.form.delete({ where: { id } })
}
