'use client'

import {
  FaFont,
  FaAlignLeft,
  FaEnvelope,
  FaSortNumericUp,
  FaPhone,
  FaDotCircle,
  FaCheckSquare,
  FaCaretSquareDown,
  FaCalendar,
  FaHeading,
  FaMinus,
} from 'react-icons/fa'
import { Modal } from '@/components/ui/Modal'
import type { FieldType } from '@/features/forms/schemas/form-field.types'
import { FIELD_TYPE_LABELS } from '@/features/forms/schemas/form-field.types'

type PickerGroup = {
  label: string
  types: FieldType[]
}

const GROUPS: PickerGroup[] = [
  {
    label: 'Text & Input',
    types: ['SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'NUMBER', 'PHONE', 'DATE'],
  },
  {
    label: 'Selection',
    types: ['MCQ', 'CHECKLIST', 'DROPDOWN'],
  },
  {
    label: 'Layout',
    types: ['SECTION', 'SECTION_BREAK'],
  },
]

const TYPE_ICONS: Record<FieldType, React.ReactNode> = {
  SHORT_TEXT: <FaFont />,
  LONG_TEXT: <FaAlignLeft />,
  EMAIL: <FaEnvelope />,
  NUMBER: <FaSortNumericUp />,
  PHONE: <FaPhone />,
  MCQ: <FaDotCircle />,
  CHECKLIST: <FaCheckSquare />,
  DROPDOWN: <FaCaretSquareDown />,
  DATE: <FaCalendar />,
  SECTION: <FaHeading />,
  SECTION_BREAK: <FaMinus />,
}

const TYPE_DESCRIPTIONS: Record<FieldType, string> = {
  SHORT_TEXT: 'Single line text',
  LONG_TEXT: 'Multi-line paragraph',
  EMAIL: 'Email with validation',
  NUMBER: 'Numeric input',
  PHONE: 'Phone with country code',
  MCQ: 'Pick one from options',
  CHECKLIST: 'Pick multiple options',
  DROPDOWN: 'Select from a list',
  DATE: 'Date picker',
  SECTION: 'Title + description block',
  SECTION_BREAK: 'Splits form into pages',
}

type FieldTypePickerProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: FieldType) => void
}

export function FieldTypePicker({ isOpen, onClose, onSelect }: FieldTypePickerProps) {
  const handleSelect = (type: FieldType) => {
    onSelect(type)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Field Type" size="md">
      <div className="flex flex-col gap-5">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {group.label}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {group.types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelect(type)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 text-left hover:border-slate-900 hover:bg-slate-50 transition-all duration-150 group"
                >
                  <span className="text-slate-400 group-hover:text-slate-700 mt-0.5 text-base shrink-0">
                    {TYPE_ICONS[type]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-snug">
                      {FIELD_TYPE_LABELS[type]}
                    </p>
                    <p className="text-xs text-slate-400 leading-snug mt-0.5">
                      {TYPE_DESCRIPTIONS[type]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export { TYPE_ICONS, TYPE_DESCRIPTIONS }
