'use client'

import { useState } from 'react'
import { FaKey, FaCopy, FaCheck, FaEnvelope } from 'react-icons/fa'
import type { ActiveOtpDTO } from '@/features/employees/services/otp.service'

const PALETTE = [
  { bg: 'bg-espresso',      color: '#3B2416' },
  { bg: 'bg-mocha',         color: '#6F4A2D' },
  { bg: 'bg-caramel-burnt', color: '#8B5E3C' },
  { bg: 'bg-mocha',         color: '#6F4A2D' },
  { bg: 'bg-espresso',      color: '#3B2416' },
  { bg: 'bg-caramel-burnt', color: '#8B5E3C' },
  { bg: 'bg-mocha',         color: '#6F4A2D' },
  { bg: 'bg-espresso',      color: '#3B2416' },
]

function getPalette(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`
}

type OtpCardProps = { otp: ActiveOtpDTO }

export function OtpCard({ otp }: OtpCardProps) {
  const [copied, setCopied] = useState(false)
  const { bg, color } = getPalette(otp.employeeName)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(otp.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="bg-cream rounded-2xl border border-foam overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {/* Employee identity row */}
      <div className="flex items-center gap-3.5 px-4 py-4">
        <div
          className={[
            bg,
            'w-11 h-11 rounded-xl flex items-center justify-center',
            'text-white font-bold text-sm select-none shrink-0 shadow-sm',
          ].join(' ')}
        >
          {getInitials(otp.employeeName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-roast text-sm leading-tight truncate">
            {otp.employeeName}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <FaEnvelope className="text-cocoa shrink-0" style={{ fontSize: '9px' }} />
            <p className="text-cocoa text-xs truncate">{otp.employeeEmail}</p>
          </div>
        </div>
      </div>

      {/* OTP display */}
      <div className="px-4 pb-4">
        <div className="bg-vanilla border border-foam rounded-xl p-4 flex flex-col gap-3">
          {/* Label */}
          <div className="flex items-center gap-1.5">
            <FaKey className="text-cocoa text-xs shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cocoa">
              Share This Code
            </span>
          </div>

          {/* Code + copy button */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-4xl font-bold tracking-[0.4em] text-roast font-mono tabular-nums leading-none">
              {otp.code}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy code'}
              aria-label={copied ? 'Copied!' : 'Copy code'}
              className={[
                'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 shrink-0',
                copied
                  ? 'bg-mocha text-white'
                  : 'bg-espresso hover:bg-mocha active:bg-caramel-burnt text-white',
              ].join(' ')}
            >
              {copied ? <FaCheck className="text-sm" /> : <FaCopy className="text-sm" />}
            </button>
          </div>

          {/* Footer meta */}
          <p className="text-xs text-cocoa">
            Requested {getRelativeTime(otp.createdAt)} · Expires at midnight
          </p>
        </div>
      </div>
    </div>
  )
}
