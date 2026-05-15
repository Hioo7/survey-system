'use client'

import { FaSignOutAlt } from 'react-icons/fa'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { employeeLogoutAction } from '@/features/auth/actions/employee-logout.action'

type EmployeeLogoutConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function EmployeeLogoutConfirmModal({ isOpen, onClose }: EmployeeLogoutConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Logout?" size="sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-vanilla rounded-xl flex items-center justify-center shrink-0">
            <FaSignOutAlt className="text-cocoa text-lg" />
          </div>
          <p className="text-cocoa text-sm leading-relaxed pt-1">
            You will be signed out and will need to request a new login code from your admin.
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <form action={employeeLogoutAction} className="flex-1">
            <Button type="submit" variant="danger" icon={<FaSignOutAlt />} className="w-full">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}
