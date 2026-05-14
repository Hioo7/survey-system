'use client'

import { useState } from 'react'
import {
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaIdBadge,
  FaSignOutAlt,
} from 'react-icons/fa'
import { EmployeeLogoutConfirmModal } from './EmployeeLogoutConfirmModal'

type EmployeeProfileSectionProps = {
  employee: { name: string; email: string; createdAt: string }
  sessionValidUntil: string
}

const PALETTE = [
  { bg: 'bg-slate-700' },
  { bg: 'bg-zinc-700' },
  { bg: 'bg-slate-600' },
  { bg: 'bg-stone-600' },
  { bg: 'bg-slate-800' },
  { bg: 'bg-zinc-600' },
  { bg: 'bg-stone-700' },
  { bg: 'bg-neutral-700' },
]

function getPaletteBg(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length].bg
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function EmployeeProfileSection({ employee, sessionValidUntil }: EmployeeProfileSectionProps) {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const bg = getPaletteBg(employee.name)

  const joinedDate = new Date(employee.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const sessionDate = new Date(sessionValidUntil).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">View your account information</p>
        </div>

        {/* Identity card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div
            className={[
              bg,
              'w-16 h-16 rounded-2xl flex items-center justify-center',
              'text-white font-bold text-xl select-none shrink-0 shadow-sm',
            ].join(' ')}
          >
            {getInitials(employee.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-lg leading-tight truncate">
              {employee.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <FaEnvelope className="text-slate-400 shrink-0 text-xs" />
              <p className="text-slate-500 text-sm truncate">{employee.email}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <FaIdBadge className="text-slate-400 shrink-0 text-xs" />
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Employee
              </span>
            </div>
          </div>
        </div>

        {/* Account details card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          <div className="flex items-center gap-3.5 px-5 py-4">
            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
              <FaCalendarAlt className="text-slate-400 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-medium">Member since</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{joinedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 px-5 py-4">
            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
              <FaClock className="text-slate-400 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-medium">Session valid until</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                Midnight today ({sessionDate})
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Account
          </p>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3 min-h-[52px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      <EmployeeLogoutConfirmModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  )
}
