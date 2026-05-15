'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { verifyToken } from '@/lib/jwt'
import {
  createEditRequest,
  closeEditRequest,
  getOpenEditRequests,
  getClosedEditRequests,
  getOpenEditRequestsForEmployee,
  getSubmittedFormsForEmployee,
} from '../services/edit-request.service'
import { createEditRequestSchema, closeEditRequestSchema } from '../schemas/edit-request.schema'
import type { EditRequestDTO, SubmittedFormDTO } from '../services/edit-request.service'

export type EditRequestActionResult = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
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

async function requireEmployee(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('employee_token')?.value
  if (!token) redirect('/staff/login')
  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'employee') redirect('/staff/login')
  return payload.sub
}

export async function createEditRequestAction(
  _prevState: EditRequestActionResult,
  formData: FormData,
): Promise<EditRequestActionResult> {
  const employeeId = await requireEmployee()

  const parsed = createEditRequestSchema.safeParse({
    formId: formData.get('formId'),
    description: formData.get('description'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  try {
    await createEditRequest({ employeeId, ...parsed.data })
    revalidatePath('/employee/dashboard')
    revalidatePath('/staff/dashboard')
    return { success: true }
  } catch {
    return { error: 'Failed to submit request. Please try again.' }
  }
}

export async function closeEditRequestAction(
  id: string,
): Promise<EditRequestActionResult> {
  await requireSuperUser()

  const parsed = closeEditRequestSchema.safeParse({ id })
  if (!parsed.success) return { error: 'Invalid request ID' }

  try {
    await closeEditRequest(parsed.data.id)
    revalidatePath('/staff/dashboard')
    revalidatePath('/employee/dashboard')
    return { success: true }
  } catch {
    return { error: 'Failed to close request. Please try again.' }
  }
}

export async function getOpenEditRequestsAction(): Promise<EditRequestDTO[]> {
  await requireSuperUser()
  return getOpenEditRequests()
}

export async function getClosedEditRequestsAction(): Promise<EditRequestDTO[]> {
  await requireSuperUser()
  return getClosedEditRequests()
}

export async function getOpenEditRequestsForEmployeeAction(): Promise<EditRequestDTO[]> {
  const employeeId = await requireEmployee()
  return getOpenEditRequestsForEmployee(employeeId)
}

export async function getSubmittedFormsForEmployeeAction(): Promise<SubmittedFormDTO[]> {
  const employeeId = await requireEmployee()
  return getSubmittedFormsForEmployee(employeeId)
}
