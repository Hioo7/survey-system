'use client'

import { useState } from 'react'
import {
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaIdBadge,
  FaSignOutAlt,
} from 'react-icons/fa'
import { AvatarBadge } from '@/components/branding/AvatarBadge'
import { EmployeeLogoutConfirmModal } from './EmployeeLogoutConfirmModal'

type EmployeeProfileSectionProps = {
  employee: { name: string; email: string; createdAt: string }
  sessionValidUntil: string
}

export function EmployeeProfileSection({ employee, sessionValidUntil }: EmployeeProfileSectionProps) {
  const [logoutOpen, setLogoutOpen] = useState(false)

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
          <h1 className="text-2xl font-bold text-roast">My Profile</h1>
          <p className="text-cocoa text-sm mt-1">View your account information</p>
        </div>

        {/* Identity card */}
        <div className="bg-cream rounded-2xl border border-foam shadow-sm p-5 flex items-center gap-4">
          <AvatarBadge label={employee.name} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-roast text-lg leading-tight truncate">
              {employee.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <FaEnvelope className="text-cocoa shrink-0 text-xs" />
              <p className="text-cocoa text-sm truncate">{employee.email}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <FaIdBadge className="text-cocoa shrink-0 text-xs" />
              <span className="text-xs font-medium text-cocoa bg-vanilla px-2 py-0.5 rounded-full">
                Employee
              </span>
            </div>
          </div>
        </div>

        {/* Account details card */}
        <div className="bg-cream rounded-2xl border border-foam shadow-sm divide-y divide-vanilla">
          <div className="flex items-center gap-3.5 px-5 py-4">
            <div className="w-9 h-9 bg-vanilla rounded-xl flex items-center justify-center shrink-0">
              <FaCalendarAlt className="text-cocoa text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-cocoa font-medium">Member since</p>
              <p className="text-sm font-semibold text-roast mt-0.5">{joinedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 px-5 py-4">
            <div className="w-9 h-9 bg-vanilla rounded-xl flex items-center justify-center shrink-0">
              <FaClock className="text-cocoa text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-cocoa font-medium">Session valid until</p>
              <p className="text-sm font-semibold text-roast mt-0.5">
                Midnight today ({sessionDate})
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-cream rounded-2xl border border-foam shadow-sm p-5">
          <p className="text-xs font-semibold text-cocoa uppercase tracking-wider mb-3">
            Account
          </p>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3 min-h-[52px] rounded-xl border border-foam bg-cream hover:bg-vanilla active:bg-foam text-mocha font-semibold text-sm transition-colors"
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
