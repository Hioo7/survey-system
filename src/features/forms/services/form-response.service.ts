import { db } from '@/lib/db'
import type { FieldDTO, FormAnswers } from '../schemas/form-field.types'
import type { FormVersionDTO } from './form-version.service'
import { getAllVersionsForForm, getVersionById } from './form-version.service'

export type ExportDataDTO = {
  version: FormVersionDTO
  fields: FieldDTO[]
  responses: FormResponseDTO[]
}

export type FormResponseDTO = {
  id: string
  versionId: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  answers: FormAnswers
  latitude: number
  longitude: number
  submittedAt: string
}

export type FormResponseByVersionDTO = {
  version: FormVersionDTO
  responses: FormResponseDTO[]
}

export async function submitResponse(data: {
  versionId: string
  employeeId: string
  answers: FormAnswers
  latitude: number
  longitude: number
}): Promise<FormResponseDTO> {
  const response = await db.formResponse.create({
    data: {
      versionId: data.versionId,
      employeeId: data.employeeId,
      answers: data.answers,
      latitude: data.latitude,
      longitude: data.longitude,
    },
    include: { employee: true },
  })

  return {
    id: response.id,
    versionId: response.versionId,
    employeeId: response.employeeId,
    employeeName: response.employee.name,
    employeeEmail: response.employee.email,
    answers: response.answers as FormAnswers,
    latitude: response.latitude,
    longitude: response.longitude,
    submittedAt: response.submittedAt.toISOString(),
  }
}

export async function hasEmployeeSubmitted(
  versionId: string,
  employeeId: string,
): Promise<boolean> {
  const existing = await db.formResponse.findUnique({
    where: { versionId_employeeId: { versionId, employeeId } },
    select: { id: true },
  })
  return existing !== null
}

export async function updateResponse(
  responseId: string,
  answers: FormAnswers,
): Promise<FormResponseDTO> {
  const response = await db.formResponse.update({
    where: { id: responseId },
    data: { answers },
    include: { employee: true },
  })
  return {
    id: response.id,
    versionId: response.versionId,
    employeeId: response.employeeId,
    employeeName: response.employee.name,
    employeeEmail: response.employee.email,
    answers: response.answers as FormAnswers,
    latitude: response.latitude,
    longitude: response.longitude,
    submittedAt: response.submittedAt.toISOString(),
  }
}

export async function getResponsesForVersion(versionId: string): Promise<FormResponseDTO[]> {
  const responses = await db.formResponse.findMany({
    where: { versionId },
    include: { employee: true },
    orderBy: { submittedAt: 'asc' },
  })

  return responses.map((r) => ({
    id: r.id,
    versionId: r.versionId,
    employeeId: r.employeeId,
    employeeName: r.employee.name,
    employeeEmail: r.employee.email,
    answers: r.answers as FormAnswers,
    latitude: r.latitude,
    longitude: r.longitude,
    submittedAt: r.submittedAt.toISOString(),
  }))
}

export async function getExportDataForVersion(versionId: string): Promise<ExportDataDTO | null> {
  const version = await getVersionById(versionId)
  if (!version) return null
  const responses = await getResponsesForVersion(versionId)
  return { version, fields: version.fields, responses }
}

export async function getResponsesForForm(
  formId: string,
): Promise<FormResponseByVersionDTO[]> {
  const versions = await getAllVersionsForForm(formId)

  const result: FormResponseByVersionDTO[] = []
  for (const version of versions) {
    const responses = await getResponsesForVersion(version.id)
    result.push({ version, responses })
  }

  return result
}
