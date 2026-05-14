'use client'

import { useState } from 'react'
import { FaClipboardList, FaCheck, FaClock, FaLock } from 'react-icons/fa'
import { FormFiller } from './FormFiller'
import type { AssignedFormDTO } from '@/features/forms/services/form-assignment.service'

type EmployeeFormsSectionProps = {
  assignedForms: AssignedFormDTO[]
}

export function EmployeeFormsSection({ assignedForms }: EmployeeFormsSectionProps) {
  const [activeForm, setActiveForm] = useState<AssignedFormDTO | null>(null)

  if (activeForm) {
    return (
      <FormFiller
        assignedForm={activeForm}
        onBack={() => setActiveForm(null)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">My Forms</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {assignedForms.length > 0
            ? `${assignedForms.length} form${assignedForms.length !== 1 ? 's' : ''} assigned to you`
            : 'Forms assigned to you will appear here'}
        </p>
      </div>

      {/* Empty state */}
      {assignedForms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <FaClipboardList className="text-2xl text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-slate-700">No forms assigned</p>
            <p className="text-sm text-slate-400 mt-1">
              Your administrator will assign forms to you
            </p>
          </div>
        </div>
      )}

      {/* Form cards */}
      <div className="flex flex-col gap-3">
        {assignedForms.map((form) => {
          const hasVersion = form.latestVersion !== null
          const isSubmitted = form.hasSubmitted
          const isPending = hasVersion && !isSubmitted
          const isUnavailable = !hasVersion

          const canOpen = isPending

          return (
            <button
              key={form.formId}
              type="button"
              onClick={() => canOpen && setActiveForm(form)}
              disabled={!canOpen}
              className={[
                'w-full bg-white rounded-2xl border shadow-sm p-5 text-left transition-all duration-150',
                canOpen
                  ? 'border-slate-100 hover:border-slate-300 hover:shadow-md cursor-pointer'
                  : 'border-slate-100 cursor-default opacity-80',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-base leading-snug">
                    {form.formTitle}
                  </p>
                  {form.formDescription && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {form.formDescription}
                    </p>
                  )}
                  {hasVersion && (
                    <p className="text-xs text-slate-400 mt-2">
                      Version {form.latestVersion!.versionNumber}
                    </p>
                  )}
                </div>

                {/* Status chip */}
                <div className="shrink-0">
                  {isUnavailable && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                      <FaLock className="text-[10px]" />
                      Not available
                    </span>
                  )}
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      <FaClock className="text-[10px]" />
                      Pending
                    </span>
                  )}
                  {isSubmitted && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <FaCheck className="text-[10px]" />
                      Submitted
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
