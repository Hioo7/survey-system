'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginSchema } from '../schemas/login.schema'
import { findSuperUserByEmail, validateSuperUserPassword } from '../services/auth.service'
import { signToken } from '@/lib/jwt'

export type LoginActionState = {
  error?: string
  fieldErrors?: { email?: string[]; password?: string[] }
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as LoginActionState['fieldErrors'] }
  }

  const { email, password } = parsed.data

  const user = await findSuperUserByEmail(email)
  if (!user) return { error: 'Invalid email or password' }

  const valid = await validateSuperUserPassword(password, user.password)
  if (!valid) return { error: 'Invalid email or password' }

  const token = await signToken({ sub: user.id, email: user.email })
  const cookieStore = await cookies()
  cookieStore.set('staff_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  redirect('/staff/dashboard')
}
