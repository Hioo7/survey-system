'use client'

import { ReactNode } from 'react'

type InputProps = {
  label: string
  name: string
  type?: string
  placeholder?: string
  icon?: ReactNode
  error?: string
  required?: boolean
  autoComplete?: string
  defaultValue?: string
}

export function Input({
  label,
  name,
  type = 'text',
  placeholder,
  icon,
  error,
  required,
  autoComplete,
  defaultValue,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          className={[
            'w-full rounded-xl border bg-white text-slate-900 text-sm',
            'placeholder:text-slate-400 transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400',
            'py-2.5 pr-4 min-h-[44px]',
            icon ? 'pl-10' : 'pl-4',
            error
              ? 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
              : 'border-slate-200 hover:border-slate-300',
          ].join(' ')}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
