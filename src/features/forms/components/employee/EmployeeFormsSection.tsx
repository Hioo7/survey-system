'use client'

import { useState } from 'react'
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaFileAlt,
  FaChevronRight,
  FaListUl,
} from 'react-icons/fa'
import { FormFiller } from './FormFiller'
import type { AssignedFormDTO } from '@/features/forms/services/form-assignment.service'

type EmployeeFormsSectionProps = {
  assignedForms: AssignedFormDTO[]
}

export function EmployeeFormsSection({ assignedForms }: EmployeeFormsSectionProps) {
  const [activeForm, setActiveForm] = useState<AssignedFormDTO | null>(null)

  const pendingForms = assignedForms.filter(
    (f) => f.latestVersion !== null && !f.hasSubmitted,
  )

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
          {pendingForms.length > 0
            ? `${pendingForms.length} pending form${pendingForms.length !== 1 ? 's' : ''}`
            : 'No pending forms'}
        </p>
      </div>

      {/* Empty state — no forms assigned at all */}
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

      {/* Empty state — all forms submitted */}
      {assignedForms.length > 0 && pendingForms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
            <FaCheckCircle className="text-2xl text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-slate-700">All caught up!</p>
            <p className="text-sm text-slate-400 mt-1">
              You have submitted all your assigned forms
            </p>
          </div>
        </div>
      )}

      {/* Pending form cards */}
      <div className="flex flex-col gap-3">
        {pendingForms.map((form) => (
          <button
            key={form.formId}
            type="button"
            onClick={() => setActiveForm(form)}
            className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm text-left transition-all duration-200 hover:shadow-md hover:border-slate-300 active:scale-[0.99] cursor-pointer overflow-hidden"
            style={{ borderLeft: '3px solid #cbd5e1' }}
          >
            <div className="flex items-center gap-4 px-5 py-4">
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <FaFileAlt className="text-slate-400 text-base" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm leading-snug truncate">
                  {form.formTitle}
                </p>
                {form.formDescription && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 leading-relaxed">
                    {form.formDescription}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <FaListUl className="text-[9px]" />
                    {form.latestVersion!.fields.length} fields
                  </span>
                  <span className="text-slate-200">·</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <FaClock className="text-[9px]" />
                    Pending
                  </span>
                </div>
              </div>

              {/* Navigation cue */}
              <FaChevronRight className="text-slate-300 text-xs shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
