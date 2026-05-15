'use client'

import { Modal } from '@/components/ui/Modal'
import {
  FaClipboardList,
  FaBolt,
  FaWifi,
  FaMobileAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaChrome,
} from 'react-icons/fa'

type InstallModalProps = {
  isOpen: boolean
  onClose: () => void
  canInstall: boolean
  isInstalled: boolean
  isInstalling: boolean
  onInstall: () => Promise<boolean>
}

const benefits = [
  { icon: <FaBolt className="text-slate-500 text-sm shrink-0" />, text: 'Instant access from your home screen' },
  { icon: <FaWifi className="text-slate-500 text-sm shrink-0" />, text: 'Works offline after first visit' },
  { icon: <FaMobileAlt className="text-slate-500 text-sm shrink-0" />, text: 'Native app feel, no app store needed' },
]

export function InstallModal({
  isOpen,
  onClose,
  canInstall,
  isInstalled,
  isInstalling,
  onInstall,
}: InstallModalProps) {
  const handleInstall = async () => {
    const accepted = await onInstall()
    if (accepted) {
      setTimeout(onClose, 1200)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Install Staff Portal" size="md" hideCloseButton>
      <div className="flex flex-col gap-6">
        {/* App identity */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/20">
            <FaClipboardList className="text-white text-2xl" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-semibold text-slate-900">Staff Portal</span>
            <span className="text-sm text-slate-500 leading-snug">
              Survey & form management for your team
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Benefits list */}
        <div className="flex flex-col gap-3">
          {benefits.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {icon}
              </div>
              <span className="text-sm text-slate-600">{text}</span>
            </div>
          ))}
        </div>

        {/* State: already installed */}
        {isInstalled && (
          <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <FaCheckCircle className="text-slate-700 text-base shrink-0" />
            <span className="text-sm font-medium text-slate-700">
              Staff Portal is already installed on this device.
            </span>
          </div>
        )}

        {/* State: browser doesn't support install prompt */}
        {!canInstall && !isInstalled && (
          <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <FaInfoCircle className="text-slate-500 text-base shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">
                Your browser doesn&apos;t support direct install
              </span>
              <span className="text-xs text-slate-500 leading-relaxed flex items-center gap-1.5">
                <FaChrome className="shrink-0" />
                Use Chrome on Android or Edge on desktop to install this app.
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {canInstall && (
            <button
              type="button"
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] bg-slate-900 hover:bg-slate-700 active:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-sm transition-colors duration-150"
            >
              <FaMobileAlt />
              {isInstalling ? 'Installing…' : 'Install App'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 min-h-[48px] bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-600 font-semibold text-sm rounded-xl border border-slate-200 transition-colors duration-150"
          >
            {isInstalled ? 'Close' : 'Not Now'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
