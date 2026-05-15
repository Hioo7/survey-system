'use client'

import { useState } from 'react'
import { FaClipboardList, FaShieldAlt, FaUsers } from 'react-icons/fa'
import { Tabs } from '@/components/ui/Tabs'
import { SuperAdminLoginForm } from './SuperAdminLoginForm'
import { EmployeeLoginForm } from './EmployeeLoginForm'

const LOGIN_TABS = [
  { id: 'super-admin', label: 'Super Admin', icon: <FaShieldAlt /> },
  { id: 'employee', label: 'Employee', icon: <FaUsers /> },
]

export function StaffLoginPage() {
  const [activeTab, setActiveTab] = useState('super-admin')

  return (
    <div className="min-h-screen bg-gradient-to-br from-vanilla via-cream to-foam/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-96 h-96 bg-foam/50 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-96 h-96 bg-vanilla/60 rounded-full blur-3xl pointer-events-none"
      />
      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #C89B6D 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.35,
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-espresso rounded-2xl flex items-center justify-center shadow-lg shadow-espresso/20 mb-4">
            <FaClipboardList className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-roast tracking-tight">Staff Portal</h1>
          <p className="text-cocoa text-sm mt-1">Sign in to manage your team</p>
        </div>

        {/* Card */}
        <div className="bg-cream/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-foam/80 border border-foam p-6 flex flex-col gap-6">
          <Tabs tabs={LOGIN_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'super-admin' ? (
            <SuperAdminLoginForm />
          ) : (
            <EmployeeLoginForm />
          )}
        </div>

        <p className="text-center text-xs text-cocoa mt-6">
          Staff access only · Unauthorized access is prohibited
        </p>
      </div>
    </div>
  )
}
