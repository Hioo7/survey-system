'use client'

import { useState } from 'react'
import { FaUsers, FaKey, FaPlus, FaUserSlash } from 'react-icons/fa'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { EmployeeCard } from './EmployeeCard'
import { EmployeeModal } from './EmployeeModal'
import { EmployeeLoginsTab } from './EmployeeLoginsTab'
import type { ActiveOtpDTO } from '@/features/employees/services/otp.service'

type EmployeeDTO = { id: string; name: string; email: string; createdAt: string }

type ModalState = {
  isOpen: boolean
  mode: 'create' | 'edit'
  employee?: EmployeeDTO
}

const SECTION_TABS = [
  { id: 'users', label: 'Users', icon: <FaUsers /> },
  { id: 'employee-logins', label: 'Employee Logins', icon: <FaKey /> },
]

export function UsersSection({
  initialEmployees,
  initialOtps,
}: {
  initialEmployees: EmployeeDTO[]
  initialOtps: ActiveOtpDTO[]
}) {
  const [activeTab, setActiveTab] = useState('users')
  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'create' })

  const openCreate = () => setModal({ isOpen: true, mode: 'create', employee: undefined })
  const openEdit = (employee: EmployeeDTO) =>
    setModal({ isOpen: true, mode: 'edit', employee })
  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-roast">Team Management</h1>
        <p className="text-cocoa text-sm mt-1">Manage your team members and access</p>
      </div>

      <Tabs tabs={SECTION_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'users' ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaUsers className="text-cocoa" />
              <span className="font-semibold text-mocha text-sm">
                Team Members
              </span>
              <span className="text-xs text-cocoa bg-vanilla px-2 py-0.5 rounded-full font-medium">
                {initialEmployees.length}
              </span>
            </div>
            <Button variant="primary" size="sm" icon={<FaPlus />} onClick={openCreate}>
              Add Employee
            </Button>
          </div>

          {initialEmployees.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center gap-5">
              <div className="w-20 h-20 bg-vanilla rounded-2xl flex items-center justify-center">
                <FaUserSlash className="text-cocoa text-3xl" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-semibold text-mocha text-lg">No team members yet</h3>
                <p className="text-cocoa text-sm">Add your first employee to get started</p>
              </div>
              <Button variant="primary" icon={<FaPlus />} onClick={openCreate}>
                Add your first employee
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
              {initialEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} onEdit={openEdit} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <EmployeeLoginsTab initialOtps={initialOtps} />
      )}

      <EmployeeModal
        key={`${modal.mode}-${modal.employee?.id ?? 'new'}-${String(modal.isOpen)}`}
        isOpen={modal.isOpen}
        onClose={closeModal}
        mode={modal.mode}
        employee={modal.employee}
      />
    </div>
  )
}
