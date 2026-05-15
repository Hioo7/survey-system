'use client'

import { useActionState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { FaRocket, FaInfoCircle } from 'react-icons/fa'
import { publishFormAction, type FormActionResult } from '@/features/forms/actions/form-admin.action'
import type { FormDTO } from '@/features/forms/services/form.service'

type PublishConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  form: FormDTO
  onPublished: () => void
}

export function PublishConfirmModal({
  isOpen,
  onClose,
  form,
  onPublished,
}: PublishConfirmModalProps) {
  const [state, formAction, isPending] = useActionState<FormActionResult, FormData>(
    publishFormAction,
    {},
  )

  useEffect(() => {
    if (state.success) {
      onPublished()
      onClose()
    }
  }, [state.success, onPublished, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish Form" size="sm">
      <form action={formAction} className="flex flex-col gap-5">
        <input type="hidden" name="id" value={form.id} />

        <div className="flex gap-3 p-4 bg-vanilla rounded-xl border border-foam">
          <FaInfoCircle className="text-caramel shrink-0 mt-0.5" />
          <div className="text-sm text-mocha">
            <p className="font-medium">Publishing creates a new version snapshot.</p>
            <p className="mt-1 text-cocoa">
              Employees who already submitted v{form._count.versions} will need to submit the
              new version. Previous responses are preserved.
            </p>
          </div>
        </div>

        {state.error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{state.error}</p>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            icon={<FaRocket />}
            className="flex-1"
          >
            Publish
          </Button>
        </div>
      </form>
    </Modal>
  )
}
