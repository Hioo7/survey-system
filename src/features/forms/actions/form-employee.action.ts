'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { verifyToken } from '@/lib/jwt'
import { getVersionById } from '../services/form-version.service'
import { hasEmployeeSubmitted, submitResponse } from '../services/form-response.service'
import { buildAnswerSchema } from '../schemas/form-response.schema'
import { isInputField } from '../schemas/form-field.types'
import type { FormAnswers } from '../schemas/form-field.types'

export type SubmitFormActionResult = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

async function requireEmployee(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('employee_token')?.value
  if (!token) redirect('/staff/login')
  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'employee') {
    cookieStore.delete('employee_token')
    redirect('/staff/login')
  }
  return payload.sub
}

export async function submitFormAction(
  _prevState: SubmitFormActionResult,
  formData: FormData,
): Promise<SubmitFormActionResult> {
  const employeeId = await requireEmployee()

  const versionId = formData.get('versionId')
  if (!versionId || typeof versionId !== 'string') {
    return { error: 'Invalid form version' }
  }

  const latitude = parseFloat((formData.get('latitude') as string) ?? '')
  const longitude = parseFloat((formData.get('longitude') as string) ?? '')
  if (isNaN(latitude) || isNaN(longitude)) {
    return { error: 'Location data is missing. Please allow location access and try again.' }
  }

  const version = await getVersionById(versionId)
  if (!version) return { error: 'Form version not found' }

  const alreadySubmitted = await hasEmployeeSubmitted(versionId, employeeId)
  if (alreadySubmitted) return { error: 'You have already submitted this form' }

  const inputFields = version.fields.filter(isInputField)

  const answers: FormAnswers = {}
  for (const field of inputFields) {
    if (field.type === 'CHECKLIST') {
      answers[field.id] = formData.getAll(field.id) as string[]
    } else {
      answers[field.id] = (formData.get(field.id) as string) ?? ''
    }
  }

  const schema = buildAnswerSchema(inputFields)
  const parsed = schema.safeParse(answers)

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await submitResponse({ versionId, employeeId, answers: parsed.data as FormAnswers, latitude, longitude })
    revalidatePath('/employee/dashboard')
    return { success: true }
  } catch (e) {
    const isUniqueViolation =
      typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P2002'
    if (isUniqueViolation) return { error: 'You have already submitted this form' }
    return { error: 'Failed to submit form. Please try again.' }
  }
}
