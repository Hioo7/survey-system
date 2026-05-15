'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaSpinner,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { loginAction, type LoginActionState } from '@/features/auth/actions/login.action'
import { Input } from '@/components/ui/Input'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        'w-full flex items-center justify-center gap-2.5',
        'bg-espresso hover:bg-mocha active:bg-caramel-burnt',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        'text-white font-semibold rounded-xl py-3 min-h-[52px]',
        'transition-colors duration-150 shadow-sm',
      ].join(' ')}
    >
      {pending ? (
        <>
          <FaSpinner className="animate-spin" />
          <span>Signing in…</span>
        </>
      ) : (
        <>
          <FaSignInAlt />
          <span>Sign In</span>
        </>
      )}
    </button>
  )
}

export function SuperAdminLoginForm() {
  const [state, formAction] = useActionState<LoginActionState, FormData>(loginAction, {})

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <FaExclamationTriangle className="shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <Input
        label="Email address"
        name="email"
        type="email"
        placeholder="admin@example.com"
        icon={<FaEnvelope />}
        error={state.fieldErrors?.email?.[0]}
        required
        autoComplete="email"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        icon={<FaLock />}
        error={state.fieldErrors?.password?.[0]}
        required
        autoComplete="current-password"
      />

      <SubmitButton />
    </form>
  )
}
