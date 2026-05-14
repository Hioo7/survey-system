'use client'

import { FaExclamationCircle } from 'react-icons/fa'
import { isSection } from '@/features/forms/schemas/form-field.types'
import type { FieldDTO } from '@/features/forms/schemas/form-field.types'

type FieldRendererProps = {
  field: FieldDTO
  value: string | string[]
  onChange: (v: string | string[]) => void
  error?: string
  preview?: boolean
}

const inputCls = (error?: string) =>
  [
    'w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 min-h-[44px]',
    'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400',
    'placeholder:text-slate-400 transition-colors duration-150',
    error
      ? 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
      : 'border-slate-200 hover:border-slate-300 bg-white',
  ].join(' ')

export function FieldRenderer({ field, value, onChange, error, preview }: FieldRendererProps) {
  if (isSection(field)) {
    return (
      <div className="pb-1">
        <h2 className="text-base font-semibold text-slate-800">
          {field.sectionTitle || 'Section'}
        </h2>
        {field.sectionDescription && (
          <p className="text-sm text-slate-500 mt-1">{field.sectionDescription}</p>
        )}
      </div>
    )
  }

  const strValue = typeof value === 'string' ? value : ''
  const arrValue = Array.isArray(value) ? value : []

  const renderInput = () => {
    switch (field.type) {
      case 'SHORT_TEXT':
        return (
          <input
            type="text"
            name={field.id}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? ''}
            disabled={preview}
            className={inputCls(error)}
          />
        )

      case 'LONG_TEXT':
        return (
          <textarea
            name={field.id}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? ''}
            disabled={preview}
            rows={3}
            className={`${inputCls(error)} resize-y min-h-[100px]`}
          />
        )

      case 'EMAIL':
        return (
          <input
            type="email"
            name={field.id}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? 'your@email.com'}
            disabled={preview}
            className={inputCls(error)}
          />
        )

      case 'NUMBER':
        return (
          <input
            type="number"
            name={field.id}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? '0'}
            disabled={preview}
            className={inputCls(error)}
          />
        )

      case 'PHONE':
        return (
          <input
            type="tel"
            name={field.id}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? '+1234567890'}
            disabled={preview}
            className={inputCls(error)}
          />
        )

      case 'DATE':
        return (
          <input
            type="date"
            name={field.id}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={preview}
            className={inputCls(error)}
          />
        )

      case 'MCQ':
        return (
          <div className="flex flex-col gap-2">
            {field.options.map((opt) => {
              const checked = strValue === opt
              return (
                <label
                  key={opt}
                  className={[
                    'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150',
                    checked
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name={field.id}
                    value={opt}
                    checked={checked}
                    onChange={() => onChange(opt)}
                    disabled={preview}
                    className="sr-only"
                  />
                  <div
                    className={[
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                      checked ? 'border-slate-900' : 'border-slate-300',
                    ].join(' ')}
                  >
                    {checked && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                  </div>
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              )
            })}
          </div>
        )

      case 'CHECKLIST':
        return (
          <div className="flex flex-col gap-2">
            {field.options.map((opt) => {
              const checked = arrValue.includes(opt)
              return (
                <label
                  key={opt}
                  className={[
                    'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150',
                    checked
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    name={field.id}
                    value={opt}
                    checked={checked}
                    onChange={() => {
                      if (checked) onChange(arrValue.filter((v) => v !== opt))
                      else onChange([...arrValue, opt])
                    }}
                    disabled={preview}
                    className="sr-only"
                  />
                  <div
                    className={[
                      'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
                      checked ? 'border-slate-900 bg-slate-900' : 'border-slate-300',
                    ].join(' ')}
                  >
                    {checked && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 10 10"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              )
            })}
          </div>
        )

      case 'DROPDOWN':
        return (
          <select
            name={field.id}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={preview}
            className={`${inputCls(error)} pr-8`}
          >
            <option value="">Select an option…</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {field.label || 'Untitled Question'}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {field.description && (
        <p className="text-xs text-slate-500">{field.description}</p>
      )}
      {renderInput()}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <FaExclamationCircle className="shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
