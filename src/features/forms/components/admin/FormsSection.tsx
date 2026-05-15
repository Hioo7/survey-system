'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlus, FaClipboardList } from 'react-icons/fa'
import { FormCard } from './FormCard'
import { FormBuilder } from './FormBuilder'
import { AssignEmployeesModal } from './AssignEmployeesModal'
import { PublishConfirmModal } from './PublishConfirmModal'
import { ResponsesView } from './ResponsesView'
import type { FormDTO } from '@/features/forms/services/form.service'

type EmployeeDTO = { id: string; name: string; email: string }

type FormsView = 'list' | 'builder' | 'responses'

type FormsSectionProps = {
  initialForms: FormDTO[]
  employees: EmployeeDTO[]
}

export function FormsSection({ initialForms, employees }: FormsSectionProps) {
  const router = useRouter()
  const forms = initialForms
  const [view, setView] = useState<FormsView>('list')
  const [selectedForm, setSelectedForm] = useState<FormDTO | null>(null)
  const [assignModalForm, setAssignModalForm] = useState<FormDTO | null>(null)
  const [publishModalForm, setPublishModalForm] = useState<FormDTO | null>(null)

  const handleEdit = (form: FormDTO) => {
    setSelectedForm(form)
    setView('builder')
  }

  const handleCreate = () => {
    setSelectedForm(null)
    setView('builder')
  }

  const handleViewResponses = (form: FormDTO) => {
    setSelectedForm(form)
    setView('responses')
  }

  const handleBuilderClose = () => {
    setView('list')
    setSelectedForm(null)
  }

  const handleBuilderSaved = () => {
    router.refresh()
  }

  if (view === 'builder') {
    return (
      <FormBuilder
        form={selectedForm}
        onClose={handleBuilderClose}
        onSaved={handleBuilderSaved}
      />
    )
  }

  if (view === 'responses' && selectedForm) {
    return (
      <ResponsesView
        form={selectedForm}
        onBack={() => {
          setView('list')
          setSelectedForm(null)
        }}
      />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-roast">Forms</h2>
            <p className="text-sm text-cocoa mt-0.5">
              {forms.length > 0
                ? `${forms.length} form${forms.length !== 1 ? 's' : ''}`
                : 'Create and manage survey forms'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso text-white text-sm font-medium hover:bg-mocha min-h-[44px] transition-colors shadow-sm"
          >
            <FaPlus className="text-xs" />
            Create Form
          </button>
        </div>

        {/* Empty state */}
        {forms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-vanilla flex items-center justify-center">
              <FaClipboardList className="text-2xl text-cocoa" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-mocha">No forms yet</p>
              <p className="text-sm text-cocoa mt-1">Create your first survey form</p>
            </div>
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso text-white text-sm font-medium hover:bg-mocha min-h-[44px] transition-colors"
            >
              <FaPlus className="text-xs" />
              Create Form
            </button>
          </div>
        )}

        {/* Form cards grid */}
        {forms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onEdit={handleEdit}
                onPreview={(f) => {
                  setSelectedForm(f)
                  setView('builder')
                }}
                onAssign={(f) => setAssignModalForm(f)}
                onPublish={(f) => setPublishModalForm(f)}
                onViewResponses={handleViewResponses}
                onDeleted={() => {
                  router.refresh()
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Assign modal */}
      {assignModalForm && (
        <AssignEmployeesModal
          isOpen={true}
          onClose={() => setAssignModalForm(null)}
          form={assignModalForm}
          employees={employees}
          onSaved={() => {
            setAssignModalForm(null)
            router.refresh()
          }}
        />
      )}

      {/* Publish modal */}
      {publishModalForm && (
        <PublishConfirmModal
          isOpen={true}
          onClose={() => setPublishModalForm(null)}
          form={publishModalForm}
          onPublished={() => {
            setPublishModalForm(null)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
