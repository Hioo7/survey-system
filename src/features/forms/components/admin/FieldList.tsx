'use client'

import { FaPlus } from 'react-icons/fa'
import { FieldListItem } from './FieldListItem'
import type { FieldDTO } from '@/features/forms/schemas/form-field.types'

type FieldListProps = {
  fields: FieldDTO[]
  selectedId: string | null
  onSelect: (id: string) => void
  onMove: (id: string, dir: 'up' | 'down') => void
  onDelete: (id: string) => void
  onAddField: () => void
}

export function FieldList({
  fields,
  selectedId,
  onSelect,
  onMove,
  onDelete,
  onAddField,
}: FieldListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-3 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Fields ({fields.length})
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {fields.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-slate-400">No fields yet.</p>
            <p className="text-xs text-slate-400">Click below to add one.</p>
          </div>
        ) : (
          fields.map((field, idx) => (
            <FieldListItem
              key={field.id}
              field={field}
              isSelected={selectedId === field.id}
              isFirst={idx === 0}
              isLast={idx === fields.length - 1}
              onSelect={() => onSelect(field.id)}
              onMove={(dir) => onMove(field.id, dir)}
              onDelete={() => onDelete(field.id)}
            />
          ))
        )}
      </div>

      <div className="p-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onAddField}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:border-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-150 min-h-[44px]"
        >
          <FaPlus className="text-xs" />
          Add Field
        </button>
      </div>
    </div>
  )
}
