'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useEffect } from 'react'
import { FaSync, FaInbox } from 'react-icons/fa'
import { OtpCard } from './OtpCard'
import type { ActiveOtpDTO } from '@/features/employees/services/otp.service'

const OTP_POLL_INTERVAL_MS = 1_000

type EmployeeLoginsTabProps = { initialOtps: ActiveOtpDTO[] }

export function EmployeeLoginsTab({ initialOtps }: EmployeeLoginsTabProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(() => {
        router.refresh()
      })
    }, OTP_POLL_INTERVAL_MS)

    return () => clearInterval(id)
  }, [router])

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="font-semibold text-roast text-sm">Pending Login Requests</h3>
          {initialOtps.length > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-espresso text-white text-xs font-bold">
              {initialOtps.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-xl bg-vanilla hover:bg-foam active:bg-foam disabled:opacity-60 text-cocoa text-xs font-medium transition-colors"
        >
          <FaSync className={isPending ? 'animate-spin' : ''} style={{ fontSize: '10px' }} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {initialOtps.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center gap-4">
          <div className="w-16 h-16 bg-vanilla border border-foam rounded-2xl flex items-center justify-center">
            <FaInbox className="text-foam text-2xl" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="font-semibold text-mocha text-sm">No pending login requests</p>
            <p className="text-cocoa text-xs max-w-xs leading-relaxed">
              When an employee requests a code, it will appear here for you to share.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {initialOtps.map((otp) => (
            <OtpCard key={otp.id} otp={otp} />
          ))}
        </div>
      )}
    </div>
  )
}
