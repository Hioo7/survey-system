'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { verifyToken } from '@/lib/jwt'
import { updateEmailSchema, updatePasswordSchema } from '../schemas/profile.schema'
import {
  getSuperUserById,
  updateSuperUserEmail,
  updateSuperUserPassword,
} from '../services/profile.service'
import bcrypt from 'bcryptjs'

export type ProfileActionResult = {
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

export async function updateEmailAction(
  _prevState: ProfileActionResult,
  formData: FormData,
): Promise<ProfileActionResult> {
  const userId = await getAuthenticatedSuperUserId()

  const parsed = updateEmailSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  try {
    await updateSuperUserEmail(userId, parsed.data.email)
    revalidatePath('/staff/dashboard')
    return { success: true }
  } catch {
    return { error: 'Failed to update email' }
  }
}

export async function updatePasswordAction(
  _prevState: ProfileActionResult,
  formData: FormData,
): Promise<ProfileActionResult> {
  const userId = await getAuthenticatedSuperUserId()

  const parsed = updatePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const user = await getSuperUserById(userId)
  if (!user) return { error: 'User not found' }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password)
  if (!valid) return { error: 'Current password is incorrect' }

  try {
    await updateSuperUserPassword(userId, parsed.data.newPassword)
    revalidatePath('/staff/dashboard')
    return { success: true }
  } catch {
    return { error: 'Failed to update password' }
  }
}
