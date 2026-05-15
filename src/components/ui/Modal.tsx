'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'

type ModalSize = 'sm' | 'md' | 'lg'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: ModalSize
  hideCloseButton?: boolean
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export function Modal({ isOpen, onClose, title, children, size = 'md', hideCloseButton = false }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        className={[
          'relative w-full bg-cream rounded-2xl shadow-2xl',
          'border border-foam',
          sizeClasses[size],
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-foam">
          <h2 className="text-base font-semibold text-roast">{title}</h2>
          {!hideCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-cocoa hover:text-mocha hover:bg-vanilla transition-colors min-w-[44px] min-h-[44px]"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
