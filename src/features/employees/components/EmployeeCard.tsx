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
  { bg: 'bg-slate-700',   color: '#334155' },
  { bg: 'bg-zinc-700',    color: '#3f3f46' },
  { bg: 'bg-slate-600',   color: '#475569' },
  { bg: 'bg-stone-600',   color: '#57534e' },
  { bg: 'bg-slate-800',   color: '#1e293b' },
  { bg: 'bg-zinc-600',    color: '#52525b' },
  { bg: 'bg-stone-700',   color: '#44403c' },
  { bg: 'bg-neutral-700', color: '#404040' },
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
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
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
          <p className="font-bold text-slate-900 text-sm leading-tight truncate">
            {employee.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <FaEnvelope className="text-slate-400 shrink-0" style={{ fontSize: '9px' }} />
            <p className="text-slate-500 text-xs truncate">{employee.email}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <FaCalendarAlt className="text-slate-400 shrink-0" style={{ fontSize: '9px' }} />
            <p className="text-slate-400 text-xs">Joined {joined}</p>
          </div>
        </div>
      </div>

      {/* Action strip */}
      {!confirmDelete ? (
        <div className="flex gap-2 px-4 py-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-slate-900 hover:bg-slate-700 active:bg-slate-600 rounded-xl transition-colors"
          >
            <FaEdit />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-[44px] text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      ) : (
        /* Delete confirmation strip */
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200">
          <FaExclamationTriangle className="text-slate-400 shrink-0" style={{ fontSize: '11px' }} />
          <p className="text-xs font-semibold text-slate-700 flex-1 truncate">
            Delete {employee.name}?
          </p>
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="px-3 min-h-[36px] rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors shrink-0"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 min-h-[36px] rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-60 text-white text-xs font-semibold transition-colors shrink-0"
          >
            {isPending && <FaSpinner className="animate-spin" style={{ fontSize: '10px' }} />}
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
