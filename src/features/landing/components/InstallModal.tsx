'use client'

import { Modal } from '@/components/ui/Modal'
import { BrandMark } from '@/components/branding/BrandMark'
import {
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
  { icon: <FaBolt className="text-cocoa text-sm shrink-0" />, text: 'Instant access from your home screen' },
  { icon: <FaWifi className="text-cocoa text-sm shrink-0" />, text: 'Works offline after first visit' },
  { icon: <FaMobileAlt className="text-cocoa text-sm shrink-0" />, text: 'Native app feel, no app store needed' },
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
          <div className="w-16 h-16 bg-espresso rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg shadow-espresso/20 ring-1 ring-caramel/30">
            <BrandMark
              className="h-9 w-9"
              cupClassName="text-cream"
              steamClassName="text-caramel"
              detailClassName="text-espresso"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-semibold text-roast">Staff Portal</span>
            <span className="text-sm text-cocoa leading-snug">
              Survey & form management for your team
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-foam" />

        {/* Benefits list */}
        <div className="flex flex-col gap-3">
          {benefits.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-vanilla border border-foam flex items-center justify-center shrink-0">
                {icon}
              </div>
              <span className="text-sm text-cocoa">{text}</span>
            </div>
          ))}
        </div>

        {/* State: already installed */}
        {isInstalled && (
          <div className="flex items-center gap-3 p-4 bg-vanilla border border-foam rounded-xl">
            <FaCheckCircle className="text-mocha text-base shrink-0" />
            <span className="text-sm font-medium text-mocha">
              Staff Portal is already installed on this device.
            </span>
          </div>
        )}

        {/* State: browser doesn't support install prompt */}
        {!canInstall && !isInstalled && (
          <div className="flex items-start gap-3 p-4 bg-vanilla border border-foam rounded-xl">
            <FaInfoCircle className="text-cocoa text-base shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-mocha">
                Your browser doesn&apos;t support direct install
              </span>
              <span className="text-xs text-cocoa leading-relaxed flex items-center gap-1.5">
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
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] bg-espresso hover:bg-mocha active:bg-caramel-burnt disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-sm transition-colors duration-150"
            >
              <FaMobileAlt />
              {isInstalling ? 'Installing…' : 'Install App'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 min-h-[48px] bg-cream hover:bg-vanilla active:bg-foam text-cocoa font-semibold text-sm rounded-xl border border-foam transition-colors duration-150"
          >
            {isInstalled ? 'Close' : 'Not Now'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
