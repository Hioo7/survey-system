'use client'

import { FaSignOutAlt } from 'react-icons/fa'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { logoutAction } from '@/features/auth/actions/logout.action'

type LogoutConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function LogoutConfirmModal({ isOpen, onClose }: LogoutConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Out?" size="sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
            <FaSignOutAlt className="text-slate-500 text-lg" />
          </div>
          <p className="text-slate-600 text-sm leading-relaxed pt-1">
            You will be signed out of the staff portal. Any unsaved changes will be lost.
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <form action={logoutAction} className="flex-1">
            <Button type="submit" variant="danger" icon={<FaSignOutAlt />} className="w-full">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}
