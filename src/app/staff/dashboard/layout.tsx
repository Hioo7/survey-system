import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/jwt'
import { getAllEmployees } from '@/features/employees/services/employee.service'
import { getSuperUserById } from '@/features/super-admin/services/profile.service'
import { getActiveOtps } from '@/features/employees/services/otp.service'
import { getAllForms } from '@/features/forms/services/form.service'
import { getOpenEditRequests, getClosedEditRequests } from '@/features/edit-requests/services/edit-request.service'
import { DashboardShell } from '@/features/super-admin/components/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('staff_token')?.value
  if (!token) redirect('/staff/login')

  const payload = await verifyToken(token)
  if (!payload) redirect('/staff/login')

  const [employees, superUser, activeOtps, forms, openEditRequests, closedEditRequests] =
    await Promise.all([
      getAllEmployees(),
      getSuperUserById(payload.sub),
      getActiveOtps(),
      getAllForms(),
      getOpenEditRequests(),
      getClosedEditRequests(),
    ])

  if (!superUser) redirect('/staff/login')

  return (
    <DashboardShell
      initialEmployees={employees}
      initialOtps={activeOtps}
      superUserEmail={superUser.email}
      initialForms={forms}
      initialOpenEditRequests={openEditRequests}
      initialClosedEditRequests={closedEditRequests}
    >
      {children}
    </DashboardShell>
  )
}
