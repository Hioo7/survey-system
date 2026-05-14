'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { verifyToken } from '@/lib/jwt'
import {
  createFormSchema,
  updateFormDraftSchema,
  deleteFormSchema,
  publishFormSchema,
  assignEmployeesSchema,
} from '../schemas/form.schema'
import { createForm, updateFormDraft, deleteForm } from '../services/form.service'
import { publishForm } from '../services/form-version.service'
import {
  setFormAssignments,
  getAssignedEmployeeIds,
} from '../services/form-assignment.service'
import { getResponsesForForm, updateResponse } from '../services/form-response.service'
import { buildAnswerSchema } from '../schemas/form-response.schema'
import { isInputField } from '../schemas/form-field.types'
import { getVersionById } from '../services/form-version.service'
import type { FieldDTO } from '../schemas/form-field.types'
import type { FormAnswers } from '../schemas/form-field.types'
import type { FormResponseByVersionDTO } from '../services/form-response.service'

export type FormActionResult = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
  formId?: string
}

async function requireSuperUser(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('staff_token')?.value
  if (!token) redirect('/staff/login')
  const payload = await verifyToken(token)
  if (!payload) {
    cookieStore.delete('staff_token')
    redirect('/staff/login')
  }
  return payload.sub
}

export async function createFormAction(
  _prevState: FormActionResult,
  formData: FormData,
): Promise<FormActionResult> {
  await requireSuperUser()

  const parsed = createFormSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') ?? '',
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  try {
    const form = await createForm(parsed.data)
    revalidatePath('/staff/dashboard')
    return { success: true, formId: form.id }
  } catch {
    return { error: 'Failed to create form' }
  }
}

export async function updateFormDraftAction(
  _prevState: FormActionResult,
  formData: FormData,
): Promise<FormActionResult> {
  await requireSuperUser()

  const parsed = updateFormDraftSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    description: formData.get('description') ?? '',
    fields: formData.get('fields'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  let fields: FieldDTO[]
  try {
    fields = JSON.parse(parsed.data.fields) as FieldDTO[]
  } catch {
    return { error: 'Invalid field data' }
  }

  try {
    await updateFormDraft(parsed.data.id, {
      title: parsed.data.title,
      description: parsed.data.description,
      fields,
    })
    revalidatePath('/staff/dashboard')
    return { success: true }
  } catch {
    return { error: 'Failed to save draft' }
  }
}

export async function publishFormAction(
  _prevState: FormActionResult,
  formData: FormData,
): Promise<FormActionResult> {
  await requireSuperUser()

  const parsed = publishFormSchema.safeParse({ id: formData.get('id') })

  if (!parsed.success) {
    return { error: 'Invalid form ID' }
  }

  try {
    await publishForm(parsed.data.id)
    revalidatePath('/staff/dashboard')
    revalidatePath('/employee/dashboard')
    return { success: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to publish form'
    return { error: msg }
  }
}

export async function deleteFormAction(id: string): Promise<FormActionResult> {
  await requireSuperUser()

  const parsed = deleteFormSchema.safeParse({ id })
  if (!parsed.success) return { error: 'Invalid form ID' }

  try {
    await deleteForm(parsed.data.id)
    revalidatePath('/staff/dashboard')
    return { success: true }
  } catch {
    return { error: 'Failed to delete form' }
  }
}

export async function assignEmployeesAction(
  _prevState: FormActionResult,
  formData: FormData,
): Promise<FormActionResult> {
  await requireSuperUser()

  const parsed = assignEmployeesSchema.safeParse({
    formId: formData.get('formId'),
    employeeIds: formData.get('employeeIds'),
  })

  if (!parsed.success) {
    return { error: 'Invalid assignment data' }
  }

  let employeeIds: string[]
  try {
    employeeIds = JSON.parse(parsed.data.employeeIds) as string[]
  } catch {
    return { error: 'Invalid employee list' }
  }

  try {
    await setFormAssignments(parsed.data.formId, employeeIds)
    revalidatePath('/staff/dashboard')
    revalidatePath('/employee/dashboard')
    return { success: true }
  } catch {
    return { error: 'Failed to save assignments' }
  }
}

export async function getFormAssignmentsAction(formId: string): Promise<string[]> {
  await requireSuperUser()
  return getAssignedEmployeeIds(formId)
}

export async function getFormResponsesAction(
  formId: string,
): Promise<FormResponseByVersionDTO[]> {
  await requireSuperUser()
  return getResponsesForForm(formId)
}

export type UpdateFormResponseActionResult = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function updateFormResponseAction(
  _prevState: UpdateFormResponseActionResult,
  formData: FormData,
): Promise<UpdateFormResponseActionResult> {
  await requireSuperUser()

  const responseId = formData.get('responseId')
  const versionId = formData.get('versionId')
  if (!responseId || typeof responseId !== 'string') return { error: 'Invalid response' }
  if (!versionId || typeof versionId !== 'string') return { error: 'Invalid version' }

  const version = await getVersionById(versionId)
  if (!version) return { error: 'Form version not found' }

  const inputFields = version.fields.filter(isInputField)
  const answers: FormAnswers = {}
  for (const field of inputFields) {
    answers[field.id] = field.type === 'CHECKLIST'
      ? formData.getAll(field.id) as string[]
      : (formData.get(field.id) as string) ?? ''
  }

  const parsed = buildAnswerSchema(inputFields).safeParse(answers)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  try {
    await updateResponse(responseId, parsed.data as FormAnswers)
    revalidatePath('/staff/dashboard')
    return { success: true }
  } catch {
    return { error: 'Failed to update response. Please try again.' }
  }
}
