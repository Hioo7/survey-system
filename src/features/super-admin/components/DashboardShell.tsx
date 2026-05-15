'use client'

import { ReactNode, useState } from 'react'
import { FaUsers, FaUserCircle, FaClipboardList, FaInbox } from 'react-icons/fa'
import { UsersSection } from '@/features/employees/components/UsersSection'
import { ProfileSection } from './ProfileSection'
import { FormsSection } from '@/features/forms/components/admin/FormsSection'
import { AdminEditRequestsSection } from '@/features/edit-requests/components/admin/AdminEditRequestsSection'
import type { ActiveOtpDTO } from '@/features/employees/services/otp.service'
import type { FormDTO } from '@/features/forms/services/form.service'
import type { EditRequestDTO } from '@/features/edit-requests/services/edit-request.service'

type EmployeeDTO = { id: string; name: string; email: string; createdAt: string }

type DashboardShellProps = {
  initialEmployees: EmployeeDTO[]
  initialOtps: ActiveOtpDTO[]
  superUserEmail: string
  initialForms: FormDTO[]
  initialOpenEditRequests: EditRequestDTO[]
  initialClosedEditRequests: EditRequestDTO[]
  children: ReactNode
}

type Section = 'users' | 'forms' | 'requests' | 'profile'

const NAV_ITEMS: { id: Section; label: string; icon: ReactNode }[] = [
  { id: 'users', label: 'Users', icon: <FaUsers className="text-[22px]" /> },
  { id: 'forms', label: 'Forms', icon: <FaClipboardList className="text-[22px]" /> },
  { id: 'requests', label: 'Requests', icon: <FaInbox className="text-[22px]" /> },
  { id: 'profile', label: 'Profile', icon: <FaUserCircle className="text-[22px]" /> },
]

export function DashboardShell({
  initialEmployees,
  initialOtps,
  superUserEmail,
  initialForms,
  initialOpenEditRequests,
  initialClosedEditRequests,
}: DashboardShellProps) {
  const [activeSection, setActiveSection] = useState<Section>('users')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6">
          {activeSection === 'users' && (
            <UsersSection initialEmployees={initialEmployees} initialOtps={initialOtps} />
          )}
          {activeSection === 'forms' && (
            <FormsSection initialForms={initialForms} employees={initialEmployees} />
          )}
          {activeSection === 'requests' && (
            <AdminEditRequestsSection
              initialOpenRequests={initialOpenEditRequests}
              initialClosedRequests={initialClosedEditRequests}
            />
          )}
          {activeSection === 'profile' && (
            <ProfileSection superUserEmail={superUserEmail} />
          )}
        </div>
      </main>

      {/* Fixed bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex max-w-3xl mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            const showBadge =
              item.id === 'requests' && initialOpenEditRequests.length > 0
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={[
                  'flex-1 flex flex-col items-center justify-center gap-1',
                  'py-3 min-h-[60px] transition-colors duration-150 relative',
                  isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600',
                ].join(' ')}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-slate-900 rounded-full" />
                )}
                <span className="relative">
                  {item.icon}
                  {showBadge && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </span>
                <span className={['text-xs font-medium', isActive ? 'text-slate-900' : ''].join(' ')}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
