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
      <label htmlFor={name} className="text-sm font-medium text-mocha">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cocoa">
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
            'w-full rounded-xl border bg-cream text-roast text-sm',
            'placeholder:text-cocoa transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel',
            'py-2.5 pr-4 min-h-[44px]',
            icon ? 'pl-10' : 'pl-4',
            error
              ? 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
              : 'border-foam hover:border-caramel',
          ].join(' ')}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
