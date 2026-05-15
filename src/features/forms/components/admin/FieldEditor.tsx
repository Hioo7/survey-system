'use client'

import { useState } from 'react'
import { FaTrash, FaPlus, FaChevronDown, FaChevronUp, FaExchangeAlt } from 'react-icons/fa'
import { FIELD_TYPE_LABELS, hasOptions, isInputField } from '@/features/forms/schemas/form-field.types'
import type { FieldDTO, FieldType } from '@/features/forms/schemas/form-field.types'

type FieldEditorProps = {
  field: FieldDTO
  onChange: (updated: FieldDTO) => void
  onChangeType: () => void
}

export function FieldEditor({ field, onChange, onChangeType }: FieldEditorProps) {
  const [validationOpen, setValidationOpen] = useState(false)

  const update = (patch: Partial<FieldDTO>) => onChange({ ...field, ...patch })

  const isInput = isInputField(field)
  const isSectionBreak = field.type === 'SECTION_BREAK'
  const isSection = field.type === 'SECTION'
  const showOptions = hasOptions(field)
  const showPlaceholder = ['SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'NUMBER', 'PHONE'].includes(field.type as FieldType)
  const showValidation = ['SHORT_TEXT', 'LONG_TEXT', 'NUMBER'].includes(field.type as FieldType)

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...field.options]
    newOptions[idx] = value
    update({ options: newOptions })
  }

  const handleAddOption = () => {
    update({ options: [...field.options, `Option ${field.options.length + 1}`] })
  }

  const handleRemoveOption = (idx: number) => {
    update({ options: field.options.filter((_, i) => i !== idx) })
  }

  return (
    <div className="flex flex-col gap-5 p-5 overflow-y-auto h-full">
      {/* Field type chip */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-vanilla text-mocha text-xs font-medium">
          {FIELD_TYPE_LABELS[field.type]}
        </span>
        <button
          type="button"
          onClick={onChangeType}
          className="inline-flex items-center gap-1.5 text-xs text-cocoa hover:text-roast transition-colors"
        >
          <FaExchangeAlt className="text-[10px]" />
          Change Type
        </button>
      </div>

      {/* SECTION_BREAK: static message */}
      {isSectionBreak && (
        <div className="p-4 rounded-xl bg-vanilla border border-foam text-sm text-cocoa">
          This is a <strong className="text-mocha">page break</strong>. Fields after this
          will appear on the next page when employees fill the form.
        </div>
      )}

      {/* SECTION fields */}
      {isSection && (
        <>
          <LabeledInput
            label="Section Title"
            value={field.sectionTitle ?? ''}
            onChange={(v) => update({ sectionTitle: v })}
            placeholder="e.g. Personal Information"
            required
          />
          <LabeledTextarea
            label="Section Description"
            value={field.sectionDescription ?? ''}
            onChange={(v) => update({ sectionDescription: v })}
            placeholder="Optional description for this section"
          />
        </>
      )}

      {/* Input fields */}
      {isInput && !isSection && (
        <>
          <LabeledInput
            label="Question Label"
            value={field.label ?? ''}
            onChange={(v) => update({ label: v })}
            placeholder="Enter your question"
            required
          />

          <LabeledTextarea
            label="Helper Text"
            value={field.description ?? ''}
            onChange={(v) => update({ description: v })}
            placeholder="Optional hint shown below the field"
          />

          {showPlaceholder && (
            <LabeledInput
              label="Placeholder"
              value={field.placeholder ?? ''}
              onChange={(v) => update({ placeholder: v })}
              placeholder="Shown inside the empty input"
            />
          )}

          {/* Required toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mocha">Required</p>
              <p className="text-xs text-cocoa">Employee must answer this question</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={field.required}
              onClick={() => update({ required: !field.required })}
              className={[
                'inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200',
                field.required ? 'bg-espresso' : 'bg-foam',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className={[
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200',
                  field.required ? 'translate-x-5' : 'translate-x-0',
                ].join(' ')}
              />
            </button>
          </div>

          {/* Options list */}
          {showOptions && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-mocha">Options</p>
              {field.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 rounded-xl border border-foam px-3 py-2 text-sm text-roast focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel min-h-[40px]"
                    placeholder={`Option ${idx + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    disabled={field.options.length <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-cocoa hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center gap-1.5 text-sm text-cocoa hover:text-roast py-1 transition-colors"
              >
                <FaPlus className="text-xs" />
                Add option
              </button>
            </div>
          )}

          {/* Validation section */}
          {showValidation && (
            <div className="border border-foam rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setValidationOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-cocoa hover:bg-vanilla transition-colors min-h-[44px]"
              >
                Validation
                {validationOpen ? (
                  <FaChevronUp className="text-xs text-cocoa" />
                ) : (
                  <FaChevronDown className="text-xs text-cocoa" />
                )}
              </button>

              {validationOpen && (
                <div className="px-4 pb-4 flex flex-col gap-3 border-t border-foam">
                  {(field.type === 'SHORT_TEXT' || field.type === 'LONG_TEXT') && (
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <NumberInput
                        label="Min Length"
                        value={field.validationMinLength}
                        onChange={(v) => update({ validationMinLength: v })}
                      />
                      <NumberInput
                        label="Max Length"
                        value={field.validationMaxLength}
                        onChange={(v) => update({ validationMaxLength: v })}
                      />
                    </div>
                  )}
                  {field.type === 'NUMBER' && (
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <NumberInput
                        label="Min Value"
                        value={field.validationMin}
                        onChange={(v) => update({ validationMin: v })}
                        isFloat
                      />
                      <NumberInput
                        label="Max Value"
                        value={field.validationMax}
                        onChange={(v) => update({ validationMax: v })}
                        isFloat
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-mocha">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-foam px-4 py-2.5 text-sm text-roast focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel min-h-[44px] placeholder:text-cocoa"
      />
    </div>
  )
}

function LabeledTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-mocha">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="rounded-xl border border-foam px-4 py-2.5 text-sm text-roast focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel placeholder:text-cocoa resize-y min-h-[72px]"
      />
    </div>
  )
}

function NumberInput({
  label,
  value,
  onChange,
  isFloat,
}: {
  label: string
  value: number | null
  onChange: (v: number | null) => void
  isFloat?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-cocoa">{label}</label>
      <input
        type="number"
        step={isFloat ? '0.01' : '1'}
        value={value ?? ''}
        onChange={(e) => {
          const raw = e.target.value
          onChange(raw === '' ? null : isFloat ? parseFloat(raw) : parseInt(raw, 10))
        }}
        className="rounded-xl border border-foam px-3 py-2 text-sm text-roast focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel min-h-[40px]"
        placeholder="—"
      />
    </div>
  )
}
