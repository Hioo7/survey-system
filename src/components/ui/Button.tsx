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
    'bg-espresso hover:bg-mocha active:bg-caramel-burnt text-white border-transparent shadow-sm',
  secondary:
    'bg-cream hover:bg-vanilla active:bg-foam text-mocha border-foam shadow-sm',
  danger:
    'bg-cream hover:bg-vanilla active:bg-foam text-roast border-foam shadow-sm',
  ghost:
    'bg-transparent hover:bg-vanilla active:bg-foam text-cocoa border-transparent',
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
