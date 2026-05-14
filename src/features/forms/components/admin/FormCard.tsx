'use client'

import { useState, useTransition } from 'react'
import {
  FaPencilAlt,
  FaEye,
  FaUserPlus,
  FaRocket,
  FaChartBar,
  FaTrash,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { deleteFormAction } from '@/features/forms/actions/form-admin.action'
import type { FormDTO } from '@/features/forms/services/form.service'

type FormCardProps = {
  form: FormDTO
  onEdit: (form: FormDTO) => void
  onPreview: (form: FormDTO) => void
  onAssign: (form: FormDTO) => void
  onPublish: (form: FormDTO) => void
  onViewResponses: (form: FormDTO) => void
  onDeleted: () => void
}

export function FormCard({
  form,
  onEdit,
  onPreview,
  onAssign,
  onPublish,
  onViewResponses,
  onDeleted,
}: FormCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteFormAction(form.id)
      if (result.success) {
        onDeleted()
      } else {
        setError(result.error ?? 'Failed to delete')
        setConfirmDelete(false)
      }
    })
  }

  const createdDate = new Date(form.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const isPublished = form.status === 'PUBLISHED'

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 text-base leading-snug truncate">
              {form.title}
            </h3>
            <span
              className={[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
                isPublished
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-600',
              ].join(' ')}
            >
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pb-3">
        {form.description ? (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {form.description}
          </p>
        ) : (
          <p className="text-sm text-slate-300 italic">No description</p>
        )}
      </div>

      {/* Meta */}
      <div className="px-5 pb-4">
        <p className="text-xs text-slate-400">
          {form.fields.length} field{form.fields.length !== 1 ? 's' : ''} ·{' '}
          {form._count.assignments} employee{form._count.assignments !== 1 ? 's' : ''} ·{' '}
          {isPublished ? `v${form._count.versions}` : 'unpublished'} · {createdDate}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-5 mb-3 flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-xs">
          <FaExclamationTriangle className="shrink-0" />
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-slate-100 px-4 py-3 flex items-center gap-1">
        {!confirmDelete ? (
          <>
            <ActionBtn label="Edit" onClick={() => onEdit(form)}>
              <FaPencilAlt />
            </ActionBtn>
            <ActionBtn label="Preview" onClick={() => onPreview(form)}>
              <FaEye />
            </ActionBtn>
            <ActionBtn label="Assign" onClick={() => onAssign(form)}>
              <FaUserPlus />
            </ActionBtn>
            <ActionBtn
              label="Publish"
              onClick={() => onPublish(form)}
              disabled={isPublished}
              className={isPublished ? 'opacity-30 cursor-not-allowed' : ''}
            >
              <FaRocket />
            </ActionBtn>
            <ActionBtn label="Responses" onClick={() => onViewResponses(form)}>
              <FaChartBar />
            </ActionBtn>
            <div className="flex-1" />
            <ActionBtn
              label="Delete"
              onClick={() => setConfirmDelete(true)}
              className="hover:text-red-500 hover:bg-red-50"
            >
              <FaTrash />
            </ActionBtn>
          </>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-slate-600 flex-1">Delete this form?</span>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 min-h-[32px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 min-h-[32px]"
            >
              {isPending ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ActionBtn({
  children,
  label,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-9 h-9 min-w-[36px] flex items-center justify-center rounded-xl',
        'text-slate-400 hover:text-slate-700 hover:bg-slate-100',
        'transition-colors duration-150 text-sm',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
