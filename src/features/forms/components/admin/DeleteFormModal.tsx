'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { FaExclamationTriangle } from 'react-icons/fa'
import type { FormDTO } from '@/features/forms/services/form.service'

type DeleteFormModalProps = {
  isOpen: boolean
  onClose: () => void
  form: FormDTO
  onDeleted: () => void
}

export function DeleteFormModal({ isOpen, onClose, form, onDeleted }: DeleteFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Form" size="sm">
      <div className="flex flex-col gap-5">
        <div className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
          <FaExclamationTriangle className="text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            <p className="font-medium">This action cannot be undone.</p>
            <p className="mt-1 text-red-600">
              Deleting <strong>&quot;{form.title}&quot;</strong> will permanently remove all its
              versions, employee assignments, and submitted responses.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onDeleted}
            className="flex-1 !bg-red-500 !hover:bg-red-600 !text-white !border-red-500"
          >
            Delete Form
          </Button>
        </div>
      </div>
    </Modal>
  )
}
