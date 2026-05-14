'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { verifyToken } from '@/lib/jwt'
import { createEmployeeSchema, updateEmployeeSchema } from '../schemas/employee.schema'
import { createEmployee, updateEmployee, deleteEmployee } from '../services/employee.service'
export type EmployeeActionResult = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

async function getAuthenticatedSuperUserId(): Promise<string> {
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

function isUniqueConstraintError(e: unknown): boolean {
  return typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P2002'
}

export async function createEmployeeAction(
  _prevState: EmployeeActionResult,
  formData: FormData,
): Promise<EmployeeActionResult> {
  await getAuthenticatedSuperUserId()

  const parsed = createEmployeeSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  try {
    await createEmployee(parsed.data)
    revalidatePath('/staff/dashboard')
    return { success: true }
  } catch (e) {
    if (isUniqueConstraintError(e)) return { error: 'Email already in use' }
    return { error: 'Failed to create employee' }
  }
}

export async function updateEmployeeAction(
  _prevState: EmployeeActionResult,
  formData: FormData,
): Promise<EmployeeActionResult> {
  await getAuthenticatedSuperUserId()

  const parsed = updateEmployeeSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  try {
    await updateEmployee(parsed.data.id, { name: parsed.data.name, email: parsed.data.email })
    revalidatePath('/staff/dashboard')
    return { success: true }
  } catch (e) {
    if (isUniqueConstraintError(e)) return { error: 'Email already in use' }
    return { error: 'Failed to update employee' }
  }
}

export async function deleteEmployeeAction(id: string): Promise<EmployeeActionResult> {
  await getAuthenticatedSuperUserId()

  try {
    await deleteEmployee(id)
    revalidatePath('/staff/dashboard')
    return { success: true }
  } catch {
    return { error: 'Failed to delete employee' }
  }
}
