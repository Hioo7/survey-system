'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  FaUsers,
  FaKey,
  FaEnvelope,
  FaCheck,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft,
} from 'react-icons/fa'
import { Input } from '@/components/ui/Input'
import {
  requestOtpAction,
  verifyOtpAction,
  type RequestOtpState,
  type VerifyOtpState,
} from '@/features/auth/actions/employee-login.action'

// ── Stage 1 submit button ──────────────────────────────────────────────────

function RequestButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2.5 bg-espresso hover:bg-mocha active:bg-caramel-burnt disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 min-h-[52px] transition-colors duration-150 shadow-sm"
    >
      {pending ? <FaSpinner className="animate-spin" /> : <FaKey />}
      {pending ? 'Requesting…' : 'Request Code'}
    </button>
  )
}

// ── Stage 2 submit button ──────────────────────────────────────────────────

function VerifyButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2.5 bg-espresso hover:bg-mocha active:bg-caramel-burnt disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 min-h-[52px] transition-colors duration-150 shadow-sm"
    >
      {pending ? <FaSpinner className="animate-spin" /> : <FaCheck />}
      {pending ? 'Verifying…' : 'Verify Code'}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

type Stage = 'email' | 'otp'
type StageData = { employeeId: string; employeeEmail: string }

export function EmployeeLoginForm() {
  const [forceEmail, setForceEmail] = useState(false)

  const [requestState, requestAction] = useActionState<RequestOtpState, FormData>(
    requestOtpAction,
    {},
  )
  const [verifyState, verifyAction] = useActionState<VerifyOtpState, FormData>(verifyOtpAction, {})

  const stageData: StageData | null =
    !forceEmail && requestState.success && requestState.employeeId && requestState.employeeEmail
      ? { employeeId: requestState.employeeId, employeeEmail: requestState.employeeEmail }
      : null
  const stage: Stage = stageData ? 'otp' : 'email'

  const goBack = () => setForceEmail(true)

  // ── Stage 1: email ───────────────────────────────────────────────────────

  if (stage === 'email') {
    return (
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 pb-1">
          <div className="w-14 h-14 bg-espresso rounded-2xl flex items-center justify-center shadow-md shadow-foam">
            <FaUsers className="text-white text-2xl" />
          </div>
          <div className="text-center">
            <h2 className="font-bold text-roast text-lg">Employee Login</h2>
            <p className="text-cocoa text-sm mt-1">
              Enter your work email to request a login code
            </p>
          </div>
        </div>

        {requestState.error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <FaExclamationTriangle className="shrink-0 mt-0.5" />
            <span>{requestState.error}</span>
          </div>
        )}

        <form action={requestAction} className="flex flex-col gap-4">
          <Input
            label="Work Email"
            name="email"
            type="email"
            placeholder="you@company.com"
            icon={<FaEnvelope />}
            error={requestState.fieldErrors?.email?.[0]}
            required
            autoComplete="email"
          />
          <RequestButton />
        </form>
      </div>
    )
  }

  // ── Stage 2: OTP ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 pb-1">
        <div className="w-14 h-14 bg-espresso rounded-2xl flex items-center justify-center shadow-md shadow-foam">
          <FaKey className="text-white text-2xl" />
        </div>
        <div className="text-center">
          <h2 className="font-bold text-roast text-lg">Enter Your Code</h2>
          <p className="text-cocoa text-sm mt-1">
            Ask your admin to open the Employee Logins panel and share your code
          </p>
        </div>
      </div>

      {/* Email chip */}
      <div className="flex items-center justify-between bg-vanilla border border-foam rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <FaEnvelope className="text-cocoa shrink-0 text-sm" />
          <span className="text-cocoa text-sm font-medium truncate">
            {stageData?.employeeEmail}
          </span>
        </div>
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs text-cocoa hover:text-roast font-medium ml-3 shrink-0 min-h-[44px] px-2"
        >
          <FaArrowLeft className="text-xs" />
          Change
        </button>
      </div>

      {verifyState.error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <FaExclamationTriangle className="shrink-0 mt-0.5" />
          <span>{verifyState.error}</span>
        </div>
      )}

      <form action={verifyAction} className="flex flex-col gap-4">
        <input type="hidden" name="employeeId" value={stageData?.employeeId ?? ''} />

        {/* Styled OTP input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-sm font-medium text-mocha">
            6-Digit Code <span className="text-red-500">*</span>
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            required
            autoComplete="one-time-code"
            className="w-full text-center text-3xl font-bold tracking-[0.5em] rounded-xl border border-foam hover:border-caramel bg-cream text-roast placeholder:text-foam py-4 min-h-[64px] focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel transition-colors"
          />
          <p className="text-xs text-cocoa text-center">
            Numbers only · expires at midnight today
          </p>
        </div>

        <VerifyButton />
      </form>
    </div>
  )
}
