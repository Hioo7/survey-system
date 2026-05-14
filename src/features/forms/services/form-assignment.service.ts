import { db } from '@/lib/db'
import type { FieldDTO } from '../schemas/form-field.types'

export type AssignedFormDTO = {
  formId: string
  formTitle: string
  formDescription: string
  latestVersion: {
    id: string
    versionNumber: number
    fields: FieldDTO[]
  } | null
  hasSubmitted: boolean
}

export type FormAssignmentDTO = {
  id: string
  formId: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  assignedAt: string
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

export async function setFormAssignments(
  formId: string,
  employeeIds: string[],
): Promise<void> {
  await db.$transaction([
    db.formAssignment.deleteMany({ where: { formId } }),
    ...(employeeIds.length > 0
      ? [
          db.formAssignment.createMany({
            data: employeeIds.map((employeeId) => ({ formId, employeeId })),
          }),
        ]
      : []),
  ])
}

export async function getAssignedEmployeeIds(formId: string): Promise<string[]> {
  const assignments = await db.formAssignment.findMany({
    where: { formId },
    select: { employeeId: true },
  })
  return assignments.map((a) => a.employeeId)
}

export async function getAssignmentsForForm(formId: string): Promise<FormAssignmentDTO[]> {
  const assignments = await db.formAssignment.findMany({
    where: { formId },
    include: { employee: true },
    orderBy: { assignedAt: 'desc' },
  })

  return assignments.map((a) => ({
    id: a.id,
    formId: a.formId,
    employeeId: a.employeeId,
    employeeName: a.employee.name,
    employeeEmail: a.employee.email,
    assignedAt: a.assignedAt.toISOString(),
  }))
}

export async function getEmployeeFormsWithStatus(
  employeeId: string,
): Promise<AssignedFormDTO[]> {
  const assignments = await db.formAssignment.findMany({
    where: { employeeId },
    include: {
      form: {
        include: {
          versions: {
            orderBy: { versionNumber: 'desc' },
            take: 1,
            include: { fields: { orderBy: { order: 'asc' } } },
          },
        },
      },
    },
  })

  const latestVersionIds = assignments
    .map((a) => a.form.versions[0]?.id)
    .filter((id): id is string => id !== undefined)

  const submittedResponses = await db.formResponse.findMany({
    where: { employeeId, versionId: { in: latestVersionIds } },
    select: { versionId: true },
  })

  const submittedSet = new Set(submittedResponses.map((r) => r.versionId))

  return assignments.map((a) => {
    const latestVersion = a.form.versions[0] ?? null
    return {
      formId: a.formId,
      formTitle: a.form.title,
      formDescription: a.form.description,
      latestVersion: latestVersion
        ? {
            id: latestVersion.id,
            versionNumber: latestVersion.versionNumber,
            fields: latestVersion.fields.map(mapVersionField),
          }
        : null,
      hasSubmitted: latestVersion ? submittedSet.has(latestVersion.id) : false,
    }
  })
}
