'use client'

import { useActionState, useEffect } from 'react'
import { FaEnvelope, FaEdit, FaExclamationTriangle } from 'react-icons/fa'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  updateEmailAction,
  type ProfileActionResult,
} from '@/features/super-admin/actions/profile.action'

type UpdateEmailModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function UpdateEmailModal({ isOpen, onClose }: UpdateEmailModalProps) {
  const [state, formAction, isPending] = useActionState<ProfileActionResult, FormData>(
    updateEmailAction,
    {},
  )

  useEffect(() => {
    if (state.success) onClose()
  }, [state.success, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Email" size="md">
      <form action={formAction} className="flex flex-col gap-5">
        {state.error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <FaExclamationTriangle className="shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <Input
          label="New Email Address"
          name="email"
          type="email"
          placeholder="new@email.com"
          icon={<FaEnvelope />}
          error={state.fieldErrors?.email?.[0]}
          required
          autoComplete="email"
        />

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            icon={<FaEdit />}
            className="flex-1"
          >
            Update Email
          </Button>
        </div>
      </form>
    </Modal>
  )
}
