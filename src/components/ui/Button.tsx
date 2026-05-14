'use client'

import { ReactNode } from 'react'
import { FaSpinner } from 'react-icons/fa'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  icon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 hover:bg-slate-700 active:bg-slate-600 text-white border-transparent shadow-sm',
  secondary:
    'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border-slate-200 shadow-sm',
  danger:
    'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border-slate-300 shadow-sm',
  ghost:
    'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 border-transparent',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-2 min-h-[36px] rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2.5 min-h-[44px] rounded-xl gap-2',
  lg: 'text-base px-6 py-3 min-h-[52px] rounded-xl gap-2',
}

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center font-medium border',
        'transition-all duration-150 cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  )
}
