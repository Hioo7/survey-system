'use client'

import { useState } from 'react'
import { FaKey, FaCopy, FaCheck, FaEnvelope } from 'react-icons/fa'
import type { ActiveOtpDTO } from '@/features/employees/services/otp.service'

const PALETTE = [
  { bg: 'bg-slate-700',   color: '#334155' },
  { bg: 'bg-zinc-700',    color: '#3f3f46' },
  { bg: 'bg-slate-600',   color: '#475569' },
  { bg: 'bg-stone-600',   color: '#57534e' },
  { bg: 'bg-slate-800',   color: '#1e293b' },
  { bg: 'bg-zinc-600',    color: '#52525b' },
  { bg: 'bg-stone-700',   color: '#44403c' },
  { bg: 'bg-neutral-700', color: '#404040' },
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
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
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
          <p className="font-bold text-slate-900 text-sm leading-tight truncate">
            {otp.employeeName}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <FaEnvelope className="text-slate-400 shrink-0" style={{ fontSize: '9px' }} />
            <p className="text-slate-500 text-xs truncate">{otp.employeeEmail}</p>
          </div>
        </div>
      </div>

      {/* OTP display */}
      <div className="px-4 pb-4">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-3">
          {/* Label */}
          <div className="flex items-center gap-1.5">
            <FaKey className="text-slate-400 text-xs shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Share This Code
            </span>
          </div>

          {/* Code + copy button */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-4xl font-bold tracking-[0.4em] text-slate-900 font-mono tabular-nums leading-none">
              {otp.code}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={[
                'flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold transition-all duration-150 shrink-0',
                copied
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-900 hover:bg-slate-700 active:bg-slate-600 text-white',
              ].join(' ')}
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Footer meta */}
          <p className="text-xs text-slate-400">
            Requested {getRelativeTime(otp.createdAt)} · Expires at midnight
          </p>
        </div>
      </div>
    </div>
  )
}
