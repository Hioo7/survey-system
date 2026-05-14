'use client'

import { useState, useActionState } from 'react'
import {
  FaUserCircle,
  FaEnvelope,
  FaLock,
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEdit,
} from 'react-icons/fa'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { LogoutConfirmModal } from './LogoutConfirmModal'
import {
  updateEmailAction,
  updatePasswordAction,
  type ProfileActionResult,
} from '@/features/super-admin/actions/profile.action'

type ProfileSectionProps = {
  superUserEmail: string
}

function getInitials(email: string): string {
  return email.split('@')[0].slice(0, 2).toUpperCase()
}

export function ProfileSection({ superUserEmail }: ProfileSectionProps) {
  const [logoutOpen, setLogoutOpen] = useState(false)

  const [emailState, emailAction, emailPending] = useActionState<ProfileActionResult, FormData>(
    updateEmailAction,
    {},
  )
  const [passwordState, passwordAction, passwordPending] = useActionState<
    ProfileActionResult,
    FormData
  >(updatePasswordAction, {})

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

      {/* Update Email */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
            <FaEnvelope className="text-slate-400" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Update Email</h2>
            <p className="text-xs text-slate-400">Change your login email address</p>
          </div>
        </div>

        {emailState.success && (
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm">
            <FaCheckCircle className="shrink-0" />
            <span>Email updated successfully</span>
          </div>
        )}
        {emailState.error && (
          <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <FaExclamationTriangle className="shrink-0" />
            <span>{emailState.error}</span>
          </div>
        )}

        <form action={emailAction} className="flex flex-col gap-4">
          <Input
            label="New Email Address"
            name="email"
            type="email"
            placeholder="new@email.com"
            icon={<FaEnvelope />}
            error={emailState.fieldErrors?.email?.[0]}
            required
          />
          <Button type="submit" variant="primary" isLoading={emailPending} icon={<FaEdit />}>
            Update Email
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
            <FaLock className="text-slate-400" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Change Password</h2>
            <p className="text-xs text-slate-400">Update your account password</p>
          </div>
        </div>

        {passwordState.success && (
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm">
            <FaCheckCircle className="shrink-0" />
            <span>Password updated successfully</span>
          </div>
        )}
        {passwordState.error && (
          <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <FaExclamationTriangle className="shrink-0" />
            <span>{passwordState.error}</span>
          </div>
        )}

        <form action={passwordAction} className="flex flex-col gap-4">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="Enter current password"
            icon={<FaLock />}
            error={passwordState.fieldErrors?.currentPassword?.[0]}
            required
            autoComplete="current-password"
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Min 8 characters"
            icon={<FaLock />}
            error={passwordState.fieldErrors?.newPassword?.[0]}
            required
            autoComplete="new-password"
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat new password"
            icon={<FaLock />}
            error={passwordState.fieldErrors?.confirmPassword?.[0]}
            required
            autoComplete="new-password"
          />
          <Button type="submit" variant="primary" isLoading={passwordPending} icon={<FaLock />}>
            Update Password
          </Button>
        </form>
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
    </div>
  )
}
