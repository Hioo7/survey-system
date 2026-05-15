'use client'

import { FaChevronUp, FaChevronDown, FaTrash } from 'react-icons/fa'
import { TYPE_ICONS } from './FieldTypePicker'
import { FIELD_TYPE_LABELS } from '@/features/forms/schemas/form-field.types'
import type { FieldDTO } from '@/features/forms/schemas/form-field.types'

type FieldListItemProps = {
  field: FieldDTO
  isSelected: boolean
  isFirst: boolean
  isLast: boolean
  onSelect: () => void
  onMove: (dir: 'up' | 'down') => void
  onDelete: () => void
}

export function FieldListItem({
  field,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onMove,
  onDelete,
}: FieldListItemProps) {
  const isSectionBreak = field.type === 'SECTION_BREAK'
  const isSection = field.type === 'SECTION'

  const displayLabel = isSectionBreak
    ? '— Page Break —'
    : isSection
      ? (field.sectionTitle ?? 'Section Header')
      : (field.label ?? 'Untitled Question')

  return (
    <div
      className={[
        'group flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-all duration-150',
        'border-l-2',
        isSelected
          ? 'bg-vanilla border-l-espresso'
          : 'border-l-transparent hover:bg-cream hover:border-l-foam',
      ].join(' ')}
      onClick={onSelect}
    >
      {/* Type icon */}
      <span
        className={[
          'text-sm shrink-0',
          isSelected ? 'text-mocha' : 'text-cocoa',
        ].join(' ')}
      >
        {TYPE_ICONS[field.type]}
      </span>

      {/* Label */}
      <div className="flex-1 min-w-0">
        {isSectionBreak ? (
          <p className="text-xs text-cocoa italic truncate">{displayLabel}</p>
        ) : isSection ? (
          <p className="text-sm font-semibold text-mocha truncate">{displayLabel}</p>
        ) : (
          <p className="text-sm text-mocha truncate">{displayLabel}</p>
        )}
        <p className="text-xs text-cocoa">{FIELD_TYPE_LABELS[field.type]}</p>
      </div>

      {/* Controls — visible on hover/selected */}
      <div
        className={[
          'flex items-center gap-0.5 shrink-0 transition-opacity duration-150',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          disabled={isFirst}
          onClick={() => onMove('up')}
          className="w-6 h-6 flex items-center justify-center rounded text-cocoa hover:text-mocha disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FaChevronUp className="text-xs" />
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={() => onMove('down')}
          className="w-6 h-6 flex items-center justify-center rounded text-cocoa hover:text-mocha disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FaChevronDown className="text-xs" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="w-6 h-6 flex items-center justify-center rounded text-cocoa hover:text-red-500 ml-0.5"
        >
          <FaTrash className="text-xs" />
        </button>
      </div>
    </div>
  )
}
