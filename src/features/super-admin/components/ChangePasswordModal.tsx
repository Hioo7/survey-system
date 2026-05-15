'use client'

import { useActionState, useEffect } from 'react'
import { FaLock, FaExclamationTriangle } from 'react-icons/fa'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  updatePasswordAction,
  type ProfileActionResult,
} from '@/features/super-admin/actions/profile.action'

type ChangePasswordModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [state, formAction, isPending] = useActionState<ProfileActionResult, FormData>(
    updatePasswordAction,
    {},
  )

  useEffect(() => {
    if (state.success) onClose()
  }, [state.success, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password" size="md">
      <form action={formAction} className="flex flex-col gap-5">
        {state.error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <FaExclamationTriangle className="shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <Input
          label="Current Password"
          name="currentPassword"
          type="password"
          placeholder="Enter current password"
          icon={<FaLock />}
          error={state.fieldErrors?.currentPassword?.[0]}
          required
          autoComplete="current-password"
        />
        <Input
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="Min 8 characters"
          icon={<FaLock />}
          error={state.fieldErrors?.newPassword?.[0]}
          required
          autoComplete="new-password"
        />
        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat new password"
          icon={<FaLock />}
          error={state.fieldErrors?.confirmPassword?.[0]}
          required
          autoComplete="new-password"
        />

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            icon={<FaLock />}
            className="flex-1"
          >
            Change Password
          </Button>
        </div>
      </form>
    </Modal>
  )
}
