'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FaClipboardList,
  FaRocket,
  FaSignInAlt,
  FaMobileAlt,
  FaUsers,
  FaChartBar,
  FaFont,
  FaDotCircle,
  FaCheckSquare,
  FaCalendar,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaFileExcel,
} from 'react-icons/fa'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { InstallModal } from './InstallModal'

const features = [
  {
    icon: <FaClipboardList className="text-white text-xl" />,
    title: 'Smart Form Builder',
    description:
      'Create dynamic surveys with 12+ field types. Set validation rules and paginate long forms with section breaks.',
    chips: [
      { icon: <FaFont className="text-cocoa text-[10px]" />, label: 'Short Answer' },
      { icon: <FaDotCircle className="text-cocoa text-[10px]" />, label: 'Multiple Choice' },
      { icon: <FaCheckSquare className="text-cocoa text-[10px]" />, label: 'Checkboxes' },
      { icon: <FaCalendar className="text-cocoa text-[10px]" />, label: 'Date Picker' },
    ],
  },
  {
    icon: <FaUsers className="text-white text-xl" />,
    title: 'Team Management',
    description:
      'Add employees, assign forms by individual, and manage access. Super Admins control the full workflow end-to-end.',
    chips: [
      { icon: <FaShieldAlt className="text-cocoa text-[10px]" />, label: 'Admin Control' },
      { icon: <FaUsers className="text-cocoa text-[10px]" />, label: 'Employee Roster' },
      { icon: <FaSignInAlt className="text-cocoa text-[10px]" />, label: 'Secure Login' },
    ],
  },
  {
    icon: <FaChartBar className="text-white text-xl" />,
    title: 'Response Tracking',
    description:
      'Collect submissions with precise location data. Review answers per version, handle correction requests, and export to Excel.',
    chips: [
      { icon: <FaMapMarkerAlt className="text-cocoa text-[10px]" />, label: 'Location Data' },
      { icon: <FaFileExcel className="text-cocoa text-[10px]" />, label: 'Excel Export' },
      { icon: <FaChartBar className="text-cocoa text-[10px]" />, label: 'Analytics' },
    ],
  },
]

export function LandingPage() {
  const { canInstall, isInstalled, isInstalling, install } = usePWAInstall()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-espresso overflow-hidden">
        {/* Dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #6F4A2D 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.6,
          }}
        />

        {/* Blur blob – top right */}
        <div
          aria-hidden
          className="absolute -top-40 -right-40 w-[480px] h-[480px] bg-mocha/40 rounded-full blur-3xl pointer-events-none"
        />

        {/* Blur blob – bottom left */}
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-espresso/60 rounded-full blur-3xl pointer-events-none"
        />

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 py-20 sm:py-28 lg:py-36 flex flex-col items-center text-center gap-8">
          {/* Logo mark */}
          <div className="w-20 h-20 bg-cream rounded-2xl flex items-center justify-center shadow-2xl shadow-black/30">
            <FaClipboardList className="text-espresso text-3xl" />
          </div>

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-mocha/80 border border-caramel/30 rounded-full text-vanilla text-xs font-medium tracking-wide">
            <FaRocket className="text-caramel text-[10px]" />
            Enterprise Survey Management
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cream tracking-tight leading-[1.1] max-w-2xl">
            Staff Portal
          </h1>

          {/* Subheading */}
          <p className="text-caramel text-lg sm:text-xl max-w-xl leading-relaxed">
            Build surveys, manage your team, and collect responses — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm sm:max-w-none sm:justify-center">
            <Link
              href="/staff/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[52px] bg-cream hover:bg-vanilla active:bg-foam text-espresso font-semibold text-base rounded-xl shadow-lg shadow-black/20 transition-colors duration-150"
            >
              <FaSignInAlt />
              Staff Portal
            </Link>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[52px] bg-transparent hover:bg-mocha active:bg-caramel-burnt text-caramel hover:text-cream font-semibold text-base rounded-xl border border-caramel/40 hover:border-caramel transition-all duration-150"
            >
              <FaMobileAlt />
              Install App
            </button>
          </div>

          {/* Micro-copy */}
          <p className="text-caramel/70 text-sm">Staff access only · Secure enterprise login</p>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-vanilla via-cream to-foam/30 px-4 py-16 sm:py-24 flex-1">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          {/* Section header */}
          <div className="text-center flex flex-col gap-3">
            <p className="text-xs font-semibold text-cocoa uppercase tracking-widest">
              Everything you need
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-roast tracking-tight">
              Built for modern teams
            </h2>
            <p className="text-cocoa text-base max-w-md mx-auto leading-relaxed">
              From dynamic form creation to team-wide response tracking, Staff Portal covers the
              full workflow.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-cream rounded-2xl border border-foam shadow-sm hover:shadow-xl hover:shadow-foam/80 transition-shadow duration-200 p-6 flex flex-col gap-5"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-espresso rounded-xl flex items-center justify-center shadow-md shadow-espresso/10">
                  {feature.icon}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-roast">{feature.title}</h3>
                  <p className="text-cocoa text-sm leading-relaxed">{feature.description}</p>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2">
                  {feature.chips.map((chip) => (
                    <span
                      key={chip.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-vanilla border border-foam rounded-lg text-xs font-medium text-cocoa"
                    >
                      {chip.icon}
                      {chip.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-espresso px-4 py-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-cream/10 rounded-lg flex items-center justify-center">
              <FaClipboardList className="text-cream text-xs" />
            </div>
            <span className="text-cream text-sm font-semibold">Staff Portal</span>
          </div>

          {/* Legal */}
          <p className="text-caramel/70 text-xs text-center">
            Staff access only · Unauthorized access is prohibited
          </p>

          {/* Sign in link */}
          <Link
            href="/staff/login"
            className="text-caramel hover:text-cream text-xs font-medium transition-colors duration-150"
          >
            Sign In →
          </Link>
        </div>
      </footer>

      <InstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        canInstall={canInstall}
        isInstalled={isInstalled}
        isInstalling={isInstalling}
        onInstall={install}
      />
    </div>
  )
}
