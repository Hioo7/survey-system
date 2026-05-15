'use client'

import { ReactNode, useState } from 'react'
import { FaClipboardList, FaUserCircle, FaInbox } from 'react-icons/fa'
import { EmployeeFormsSection } from '@/features/forms/components/employee/EmployeeFormsSection'
import { EmployeeProfileSection } from './EmployeeProfileSection'
import { EmployeeEditRequestsSection } from '@/features/edit-requests/components/employee/EmployeeEditRequestsSection'
import type { AssignedFormDTO } from '@/features/forms/services/form-assignment.service'
import type { EditRequestDTO, SubmittedFormDTO } from '@/features/edit-requests/services/edit-request.service'

type EmployeeDashboardShellProps = {
  employee: { name: string; email: string; createdAt: string }
  sessionValidUntil: string
  assignedForms: AssignedFormDTO[]
  initialOpenEditRequests: EditRequestDTO[]
  submittedForms: SubmittedFormDTO[]
  children: ReactNode
}

type Section = 'forms' | 'requests' | 'profile'

const NAV_ITEMS: { id: Section; label: string; icon: ReactNode }[] = [
  { id: 'forms', label: 'Forms', icon: <FaClipboardList className="text-[22px]" /> },
  { id: 'requests', label: 'Requests', icon: <FaInbox className="text-[22px]" /> },
  { id: 'profile', label: 'Profile', icon: <FaUserCircle className="text-[22px]" /> },
]

export function EmployeeDashboardShell({
  employee,
  sessionValidUntil,
  assignedForms,
  initialOpenEditRequests,
  submittedForms,
}: EmployeeDashboardShellProps) {
  const [activeSection, setActiveSection] = useState<Section>('forms')

  return (
    <div className="min-h-screen bg-vanilla flex flex-col">
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6">
          {activeSection === 'forms' && (
            <EmployeeFormsSection assignedForms={assignedForms} />
          )}
          {activeSection === 'requests' && (
            <EmployeeEditRequestsSection
              initialOpenRequests={initialOpenEditRequests}
              submittedForms={submittedForms}
            />
          )}
          {activeSection === 'profile' && (
            <EmployeeProfileSection employee={employee} sessionValidUntil={sessionValidUntil} />
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-cream border-t border-foam shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex max-w-3xl mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={[
                  'flex-1 flex flex-col items-center justify-center gap-1',
                  'py-3 min-h-[60px] transition-colors duration-150 relative',
                  isActive ? 'text-roast' : 'text-cocoa hover:text-mocha',
                ].join(' ')}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-espresso rounded-full" />
                )}
                {item.icon}
                <span
                  className={['text-xs font-medium', isActive ? 'text-roast' : ''].join(' ')}
                >
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
