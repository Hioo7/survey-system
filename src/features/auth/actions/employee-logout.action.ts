'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function employeeLogoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('employee_token')
  redirect('/staff/login')
}
