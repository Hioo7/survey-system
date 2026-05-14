import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/jwt'
import { getEmployeeById } from '@/features/employees/services/employee.service'
import { getEmployeeFormsWithStatus } from '@/features/forms/services/form-assignment.service'
import { EmployeeDashboardShell } from '@/features/employees/components/EmployeeDashboardShell'

export default async function EmployeeDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('employee_token')?.value
  if (!token) redirect('/staff/login')

  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'employee') redirect('/staff/login')

  const [employee, assignedForms] = await Promise.all([
    getEmployeeById(payload.sub),
    getEmployeeFormsWithStatus(payload.sub),
  ])

  if (!employee) redirect('/staff/login')

  const midnight = new Date()
  midnight.setHours(23, 59, 59, 999)

  return (
    <EmployeeDashboardShell
      employee={employee}
      sessionValidUntil={midnight.toISOString()}
      assignedForms={assignedForms}
    >
      {children}
    </EmployeeDashboardShell>
  )
}
