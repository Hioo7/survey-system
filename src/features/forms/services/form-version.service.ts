import { db } from '@/lib/db'
import type { FieldDTO } from '../schemas/form-field.types'

export type FormVersionDTO = {
  id: string
  formId: string
  versionNumber: number
  publishedAt: string
  fields: FieldDTO[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVersionField(f: any): FieldDTO {
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

export async function publishForm(formId: string): Promise<FormVersionDTO> {
  return await db.$transaction(async (tx) => {
    const draftFields = await tx.formField.findMany({
      where: { formId },
      orderBy: { order: 'asc' },
    })

    const hasInputFields = draftFields.some(
      (f) => f.type !== 'SECTION' && f.type !== 'SECTION_BREAK',
    )
    if (!hasInputFields) {
      throw new Error('Form must have at least one input field before publishing')
    }

    const versionCount = await tx.formVersion.count({ where: { formId } })
    const versionNumber = versionCount + 1

    const version = await tx.formVersion.create({
      data: {
        formId,
        versionNumber,
        fields: {
          createMany: {
            data: draftFields.map((f) => ({
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
          },
        },
      },
      include: { fields: { orderBy: { order: 'asc' } } },
    })

    await tx.form.update({ where: { id: formId }, data: { status: 'PUBLISHED' } })

    return {
      id: version.id,
      formId: version.formId,
      versionNumber: version.versionNumber,
      publishedAt: version.publishedAt.toISOString(),
      fields: version.fields.map(mapVersionField),
    }
  })
}

export async function getLatestPublishedVersion(
  formId: string,
): Promise<FormVersionDTO | null> {
  const version = await db.formVersion.findFirst({
    where: { formId },
    orderBy: { versionNumber: 'desc' },
    include: { fields: { orderBy: { order: 'asc' } } },
  })
  if (!version) return null

  return {
    id: version.id,
    formId: version.formId,
    versionNumber: version.versionNumber,
    publishedAt: version.publishedAt.toISOString(),
    fields: version.fields.map(mapVersionField),
  }
}

export async function getVersionById(id: string): Promise<FormVersionDTO | null> {
  const version = await db.formVersion.findUnique({
    where: { id },
    include: { fields: { orderBy: { order: 'asc' } } },
  })
  if (!version) return null

  return {
    id: version.id,
    formId: version.formId,
    versionNumber: version.versionNumber,
    publishedAt: version.publishedAt.toISOString(),
    fields: version.fields.map(mapVersionField),
  }
}

export async function getAllVersionsForForm(formId: string): Promise<FormVersionDTO[]> {
  const versions = await db.formVersion.findMany({
    where: { formId },
    orderBy: { versionNumber: 'desc' },
    include: { fields: { orderBy: { order: 'asc' } } },
  })

  return versions.map((v) => ({
    id: v.id,
    formId: v.formId,
    versionNumber: v.versionNumber,
    publishedAt: v.publishedAt.toISOString(),
    fields: v.fields.map(mapVersionField),
  }))
}
