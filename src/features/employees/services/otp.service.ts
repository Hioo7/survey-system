import { db } from '@/lib/db'
import type { EmployeeDTO } from './employee.service'

export type ActiveOtpDTO = {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  code: string
  expiresAt: string
  createdAt: string
}

function getMidnight(): Date {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d
}

export async function getEmployeeByEmail(email: string): Promise<EmployeeDTO | null> {
  const e = await db.employee.findUnique({ where: { email } })
  if (!e) return null
  return { id: e.id, name: e.name, email: e.email, createdAt: e.createdAt.toISOString() }
}

export async function requestOtp(employeeId: string): Promise<string> {
  // Invalidate any existing unused OTPs for this employee
  await db.employeeOTP.updateMany({
    where: { employeeId, isUsed: false },
    data: { isUsed: true },
  })

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = getMidnight()

  await db.employeeOTP.create({
    data: { employeeId, code, expiresAt },
  })

  return code
}

export async function verifyOtp(employeeId: string, code: string): Promise<boolean> {
  const otp = await db.employeeOTP.findFirst({
    where: {
      employeeId,
      code,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
  })

  if (!otp) return false

  await db.employeeOTP.update({
    where: { id: otp.id },
    data: { isUsed: true },
  })

  await db.employeeSession.create({
    data: { employeeId, validUntil: getMidnight() },
  })

  return true
}

export async function getActiveOtps(): Promise<ActiveOtpDTO[]> {
  const otps = await db.employeeOTP.findMany({
    where: {
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    include: { employee: true },
    orderBy: { createdAt: 'desc' },
  })

  return otps.map((o) => ({
    id: o.id,
    employeeId: o.employeeId,
    employeeName: o.employee.name,
    employeeEmail: o.employee.email,
    code: o.code,
    expiresAt: o.expiresAt.toISOString(),
    createdAt: o.createdAt.toISOString(),
  }))
}
