'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getEmployeeByEmail, requestOtp, verifyOtp } from '@/features/employees/services/otp.service'
import { getEmployeeById } from '@/features/employees/services/employee.service'
import { signEmployeeToken } from '@/lib/jwt'

export type RequestOtpState = {
  success?: boolean
  employeeId?: string
  employeeEmail?: string
  error?: string
  fieldErrors?: { email?: string[] }
}

export type VerifyOtpState = {
  error?: string
}

function getMidnight(): Date {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d
}

const emailSchema = z.object({ email: z.string().email('Invalid email address') })

export async function requestOtpAction(
  _prev: RequestOtpState,
  formData: FormData,
): Promise<RequestOtpState> {
  const parsed = emailSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as RequestOtpState['fieldErrors'] }
  }

  const employee = await getEmployeeByEmail(parsed.data.email)
  if (!employee) {
    return { error: 'No account found with this email address.' }
  }

  await requestOtp(employee.id)

  return { success: true, employeeId: employee.id, employeeEmail: employee.email }
}

export async function verifyOtpAction(
  _prev: VerifyOtpState,
  formData: FormData,
): Promise<VerifyOtpState> {
  const employeeId = String(formData.get('employeeId') ?? '')
  const code = String(formData.get('code') ?? '').trim()

  if (!employeeId || !/^\d{6}$/.test(code)) {
    return { error: 'Please enter a valid 6-digit code.' }
  }

  const valid = await verifyOtp(employeeId, code)
  if (!valid) {
    return { error: 'Invalid or expired code. Ask your admin to check the panel.' }
  }

  const employee = await getEmployeeById(employeeId)
  if (!employee) return { error: 'Employee account not found.' }

  const midnight = getMidnight()
  const token = await signEmployeeToken({
    sub: employee.id,
    email: employee.email,
    expiresAt: midnight,
  })

  const cookieStore = await cookies()
  cookieStore.set('employee_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: midnight,
    path: '/',
  })

  redirect('/employee/dashboard')
}
