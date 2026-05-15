'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { deleteEmployeeAction } from '@/features/employees/actions/employee.action'

type EmployeeDTO = { id: string; name: string; email: string; createdAt: string }

type EmployeeCardProps = {
  employee: EmployeeDTO
  onEdit: (employee: EmployeeDTO) => void
}

const PALETTE = [
  { bg: 'bg-espresso',      color: '#3B2416' },
  { bg: 'bg-mocha',         color: '#6F4A2D' },
  { bg: 'bg-caramel-burnt', color: '#8B5E3C' },
  { bg: 'bg-mocha',         color: '#6F4A2D' },
  { bg: 'bg-espresso',      color: '#3B2416' },
  { bg: 'bg-caramel-burnt', color: '#8B5E3C' },
  { bg: 'bg-mocha',         color: '#6F4A2D' },
  { bg: 'bg-espresso',      color: '#3B2416' },
]

function getPalette(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export function EmployeeCard({ employee, onEdit }: EmployeeCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { bg, color } = getPalette(employee.name)

  const handleDelete = () => {
    startTransition(async () => {
      await deleteEmployeeAction(employee.id)
      router.refresh()
    })
  }

  const joined = new Date(employee.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className="bg-cream rounded-2xl border border-foam overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {/* Info row — avatar gets no right-side competition, info column fills freely */}
      <div className="flex items-center gap-3.5 px-4 py-4">
        <div
          className={[
            bg,
            'w-11 h-11 rounded-xl flex items-center justify-center',
            'text-white font-bold text-sm select-none shrink-0 shadow-sm',
          ].join(' ')}
        >
          {getInitials(employee.name)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-roast text-sm leading-tight truncate">
            {employee.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <FaEnvelope className="text-cocoa shrink-0" style={{ fontSize: '9px' }} />
            <p className="text-cocoa text-xs truncate">{employee.email}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <FaCalendarAlt className="text-cocoa shrink-0" style={{ fontSize: '9px' }} />
            <p className="text-cocoa text-xs">Joined {joined}</p>
          </div>
        </div>
      </div>

      {/* Action strip */}
      {!confirmDelete ? (
        <div className="flex gap-2 px-4 py-3 border-t border-foam">
          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-espresso hover:bg-mocha active:bg-caramel-burnt rounded-xl transition-colors"
          >
            <FaEdit />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-[44px] text-xs font-semibold text-cocoa bg-vanilla hover:bg-foam active:bg-foam rounded-xl transition-colors"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      ) : (
        /* Delete confirmation strip */
        <div className="flex items-center gap-2 px-4 py-3 bg-vanilla border-t border-foam">
          <FaExclamationTriangle className="text-cocoa shrink-0" style={{ fontSize: '11px' }} />
          <p className="text-xs font-semibold text-mocha flex-1 truncate">
            Delete {employee.name}?
          </p>
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="px-3 min-h-[36px] rounded-lg bg-cream border border-foam text-cocoa text-xs font-medium hover:bg-vanilla transition-colors shrink-0"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 min-h-[36px] rounded-lg bg-espresso hover:bg-mocha disabled:opacity-60 text-white text-xs font-semibold transition-colors shrink-0"
          >
            {isPending && <FaSpinner className="animate-spin" style={{ fontSize: '10px' }} />}
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
