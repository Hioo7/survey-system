'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaUserCircle,
  FaEnvelope,
  FaLock,
  FaSignOutAlt,
  FaEdit,
} from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { LogoutConfirmModal } from './LogoutConfirmModal'
import { UpdateEmailModal } from './UpdateEmailModal'
import { ChangePasswordModal } from './ChangePasswordModal'

type ProfileSectionProps = {
  superUserEmail: string
}

function getInitials(email: string): string {
  return email.split('@')[0].slice(0, 2).toUpperCase()
}

export function ProfileSection({ superUserEmail }: ProfileSectionProps) {
  const router = useRouter()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account settings</p>
      </div>

      {/* Identity card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0 select-none">
          {getInitials(superUserEmail)}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <FaUserCircle className="shrink-0" />
            <span>Super Admin</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <FaEnvelope className="text-slate-400 text-sm shrink-0" />
            <span className="text-slate-700 font-medium text-sm truncate">{superUserEmail}</span>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900 text-sm">Account Settings</h2>
        </div>

        {/* Email row */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-50">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
            <FaEnvelope className="text-slate-400 text-xs" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 font-medium">Email Address</p>
            <p className="text-sm text-slate-700 font-medium truncate">{superUserEmail}</p>
          </div>
          <button
            type="button"
            onClick={() => setEmailModalOpen(true)}
            className="w-9 h-9 min-w-[36px] flex items-center justify-center rounded-full text-slate-500 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors shrink-0"
          >
            <FaEdit className="text-xs" />
          </button>
        </div>

        {/* Password row */}
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
            <FaLock className="text-slate-400 text-xs" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 font-medium">Password</p>
            <p className="text-sm text-slate-500 tracking-widest">••••••••</p>
          </div>
          <button
            type="button"
            onClick={() => setPasswordModalOpen(true)}
            className="w-9 h-9 min-w-[36px] flex items-center justify-center rounded-full text-slate-500 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors shrink-0"
          >
            <FaEdit className="text-xs" />
          </button>
        </div>
      </div>

      {/* Sign out zone */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
            <FaSignOutAlt className="text-slate-500" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Sign Out</h2>
            <p className="text-xs text-slate-400">End your current session</p>
          </div>
        </div>
        <Button
          variant="danger"
          icon={<FaSignOutAlt />}
          size="lg"
          onClick={() => setLogoutOpen(true)}
          className="w-full"
        >
          Sign Out
        </Button>
      </div>

      <LogoutConfirmModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />

      <UpdateEmailModal
        isOpen={emailModalOpen}
        onClose={() => {
          setEmailModalOpen(false)
          router.refresh()
        }}
      />

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false)
          router.refresh()
        }}
      />
    </div>
  )
}
