'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaEnvelope, FaUserPlus, FaEdit, FaExclamationTriangle } from 'react-icons/fa'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  createEmployeeAction,
  updateEmployeeAction,
  type EmployeeActionResult,
} from '@/features/employees/actions/employee.action'

type EmployeeDTO = { id: string; name: string; email: string; createdAt: string }

type EmployeeModalProps = {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  employee?: EmployeeDTO
}

export function EmployeeModal({ isOpen, onClose, mode, employee }: EmployeeModalProps) {
  const router = useRouter()
  const action = mode === 'create' ? createEmployeeAction : updateEmployeeAction

  const [state, formAction, isPending] = useActionState<EmployeeActionResult, FormData>(action, {})

  useEffect(() => {
    if (state.success) {
      onClose()
      router.refresh()
    }
  }, [state.success, onClose, router])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Employee' : 'Edit Employee'}
      size="md"
    >
      <form action={formAction} className="flex flex-col gap-5">
        {mode === 'edit' && employee && (
          <input type="hidden" name="id" value={employee.id} />
        )}

        {state.error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <FaExclamationTriangle className="shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <Input
          label="Full Name"
          name="name"
          type="text"
          placeholder="Jane Smith"
          icon={<FaUser />}
          error={state.fieldErrors?.name?.[0]}
          defaultValue={employee?.name}
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="jane@company.com"
          icon={<FaEnvelope />}
          error={state.fieldErrors?.email?.[0]}
          defaultValue={employee?.email}
          required
        />

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            icon={mode === 'create' ? <FaUserPlus /> : <FaEdit />}
            className="flex-1"
          >
            {mode === 'create' ? 'Create Employee' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
