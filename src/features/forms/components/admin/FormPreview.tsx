'use client'

import { useState, useMemo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { isSectionBreak } from '@/features/forms/schemas/form-field.types'
import { FieldRenderer } from '@/features/forms/components/employee/FieldRenderer'
import type { FieldDTO } from '@/features/forms/schemas/form-field.types'

type FormPreviewProps = {
  fields: FieldDTO[]
  formTitle: string
}

export function FormPreview({ fields }: FormPreviewProps) {
  const [pageIndex, setPageIndex] = useState(0)

  const pages = useMemo(() => {
    const result: FieldDTO[][] = []
    let current: FieldDTO[] = []
    for (const field of fields) {
      if (isSectionBreak(field)) {
        result.push(current)
        current = []
      } else {
        current.push(field)
      }
    }
    result.push(current)
    return result.filter((p) => p.length > 0 || result.length === 1)
  }, [fields])

  const totalPages = Math.max(pages.length, 1)
  const safePage = Math.min(pageIndex, totalPages - 1)
  const currentFields = pages[safePage] ?? []

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preview</p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPageIndex((p) => p - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <span className="text-xs text-slate-500 tabular-nums">
              {safePage + 1}/{totalPages}
            </span>
            <button
              type="button"
              disabled={safePage === totalPages - 1}
              onClick={() => setPageIndex((p) => p + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <p className="text-xs text-slate-400">Add fields to see a preview</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-5">
            {currentFields.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={field.type === 'CHECKLIST' ? [] : ''}
                onChange={() => {}}
                preview
              />
            ))}
            {currentFields.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">Empty page</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
