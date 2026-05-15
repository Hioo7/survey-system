import { db } from '@/lib/db'

export type EditRequestDTO = {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  formId: string
  formTitle: string
  description: string
  status: 'OPEN' | 'CLOSED'
  createdAt: string
  closedAt: string | null
}

export type SubmittedFormDTO = {
  formId: string
  formTitle: string
  lastSubmittedAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEditRequest(r: any): EditRequestDTO {
  return {
    id: r.id,
    employeeId: r.employeeId,
    employeeName: r.employee.name,
    employeeEmail: r.employee.email,
    formId: r.formId,
    formTitle: r.form.title,
    description: r.description,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    closedAt: r.closedAt ? r.closedAt.toISOString() : null,
  }
}

const INCLUDE = {
  employee: { select: { name: true, email: true } },
  form: { select: { title: true } },
}

export async function createEditRequest(data: {
  employeeId: string
  formId: string
  description: string
}): Promise<EditRequestDTO> {
  const r = await db.editRequest.create({ data, include: INCLUDE })
  return mapEditRequest(r)
}

export async function closeEditRequest(id: string): Promise<EditRequestDTO> {
  const r = await db.editRequest.update({
    where: { id },
    data: { status: 'CLOSED', closedAt: new Date() },
    include: INCLUDE,
  })
  return mapEditRequest(r)
}

export async function getOpenEditRequests(): Promise<EditRequestDTO[]> {
  const rows = await db.editRequest.findMany({
    where: { status: 'OPEN' },
    include: INCLUDE,
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(mapEditRequest)
}

export async function getClosedEditRequests(): Promise<EditRequestDTO[]> {
  const rows = await db.editRequest.findMany({
    where: { status: 'CLOSED' },
    include: INCLUDE,
    orderBy: { closedAt: 'desc' },
  })
  return rows.map(mapEditRequest)
}

export async function getOpenEditRequestsForEmployee(
  employeeId: string,
): Promise<EditRequestDTO[]> {
  const rows = await db.editRequest.findMany({
    where: { employeeId, status: 'OPEN' },
    include: INCLUDE,
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(mapEditRequest)
}

export async function getSubmittedFormsForEmployee(
  employeeId: string,
): Promise<SubmittedFormDTO[]> {
  const responses = await db.formResponse.findMany({
    where: { employeeId },
    select: {
      submittedAt: true,
      version: {
        select: {
          form: { select: { id: true, title: true } },
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  })

  const seen = new Set<string>()
  const result: SubmittedFormDTO[] = []
  for (const r of responses) {
    const formId = r.version.form.id
    if (!seen.has(formId)) {
      seen.add(formId)
      result.push({
        formId,
        formTitle: r.version.form.title,
        lastSubmittedAt: r.submittedAt.toISOString(),
      })
    }
  }
  return result
}
