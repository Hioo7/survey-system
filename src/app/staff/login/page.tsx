import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { verifyToken } from '@/lib/jwt'
import { getSuperUserById } from '@/features/super-admin/services/profile.service'
import { StaffLoginPage } from '@/features/auth/components/StaffLoginPage'

export const metadata: Metadata = {
  title: 'Staff Login — Survey System',
}

export default async function LoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('staff_token')?.value
  if (token) {
    const payload = await verifyToken(token)
    if (payload) {
      const superUser = await getSuperUserById(payload.sub)
      if (superUser) redirect('/staff/dashboard')
    }
  }

  return <StaffLoginPage />
}
