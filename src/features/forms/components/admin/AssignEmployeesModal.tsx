'use client'

import { useActionState, useEffect, useState, useMemo, useTransition } from 'react'
import { FaSearch, FaUserCheck } from 'react-icons/fa'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import {
  assignEmployeesAction,
  getFormAssignmentsAction,
  type FormActionResult,
} from '@/features/forms/actions/form-admin.action'
import type { FormDTO } from '@/features/forms/services/form.service'

type EmployeeDTO = { id: string; name: string; email: string }

type AssignEmployeesModalProps = {
  isOpen: boolean
  onClose: () => void
  form: FormDTO
  employees: EmployeeDTO[]
  onSaved: () => void
}

export function AssignEmployeesModal({
  isOpen,
  onClose,
  form,
  employees,
  onSaved,
}: AssignEmployeesModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [, startLoad] = useTransition()

  const [state, formAction, isPending] = useActionState<FormActionResult, FormData>(
    assignEmployeesAction,
    {},
  )

  useEffect(() => {
    if (isOpen && !loaded) {
      startLoad(async () => {
        const ids = await getFormAssignmentsAction(form.id)
        setSelected(new Set(ids))
        setLoaded(true)
      })
    }
  }, [isOpen, form.id, loaded])

  useEffect(() => {
    if (state.success) {
      onSaved()
      onClose()
    }
  }, [state.success, onSaved, onClose])

  const filtered = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [employees, search],
  )

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Employees — ${form.title}`} size="md">
      <form
        action={(fd) => {
          fd.set('formId', form.id)
          fd.set('employeeIds', JSON.stringify([...selected]))
          formAction(fd)
        }}
        className="flex flex-col gap-4"
      >
        {/* Count */}
        <div className="flex items-center gap-2 text-sm text-cocoa">
          <FaUserCheck className="text-cocoa" />
          <span>
            <strong className="text-roast">{selected.size}</strong> of{' '}
            {employees.length} selected
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-foam bg-cream text-sm text-roast focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel min-h-[44px] placeholder:text-cocoa"
          />
        </div>

        {/* List */}
        <div className="max-h-64 overflow-y-auto flex flex-col gap-1 -mx-1 px-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-cocoa text-center py-6">No employees found</p>
          ) : (
            filtered.map((emp) => {
              const isChecked = selected.has(emp.id)
              return (
                <label
                  key={emp.id}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150',
                    isChecked ? 'bg-vanilla' : 'hover:bg-cream',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(emp.id)}
                    className="w-4 h-4 rounded accent-espresso shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-roast truncate">{emp.name}</p>
                    <p className="text-xs text-cocoa truncate">{emp.email}</p>
                  </div>
                </label>
              )
            })
          )}
        </div>

        {state.error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{state.error}</p>
        )}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending} className="flex-1">
            Save Assignments
          </Button>
        </div>
      </form>
    </Modal>
  )
}
