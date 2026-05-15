'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FaInbox, FaPlus, FaTimes, FaCircle, FaPencilAlt, FaCalendarAlt } from 'react-icons/fa'
import { createEditRequestAction } from '@/features/edit-requests/actions/edit-request.action'
import type { EditRequestDTO, SubmittedFormDTO } from '@/features/edit-requests/services/edit-request.service'
import type { EditRequestActionResult } from '@/features/edit-requests/actions/edit-request.action'

type Props = {
  initialOpenRequests: EditRequestDTO[]
  submittedForms: SubmittedFormDTO[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function EmployeeEditRequestsSection({ initialOpenRequests, submittedForms }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [fieldState, setFieldState] = useState<EditRequestActionResult>({})
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createEditRequestAction({}, formData)
      if (result.success) {
        setShowForm(false)
        setFieldState({})
        router.refresh()
      } else {
        setFieldState(result)
      }
    })
  }

  const state = fieldState

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Edit Requests</h2>
          <p className="text-sm text-slate-500 mt-0.5">Request a correction on your submission</p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 active:bg-slate-800 transition-colors min-h-[44px] shrink-0"
          >
            <FaPlus className="text-xs" />
            <span className="hidden sm:inline">New Request</span>
          </button>
        )}
      </div>

      {/* New request form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">New Edit Request</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Form selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="formId" className="text-xs font-medium text-slate-600">
                Which form needs correction?
              </label>
              {submittedForms.length === 0 ? (
                <p className="text-sm text-slate-400 py-2">
                  You have not submitted any forms yet.
                </p>
              ) : (
                <select
                  id="formId"
                  name="formId"
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent min-h-[44px] appearance-none"
                >
                  <option value="" disabled>
                    Select a form…
                  </option>
                  {submittedForms.map((f) => (
                    <option key={f.formId} value={f.formId}>
                      {f.formTitle}
                    </option>
                  ))}
                </select>
              )}
              {state.fieldErrors?.formId && (
                <p className="text-xs text-red-500">{state.fieldErrors.formId[0]}</p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-xs font-medium text-slate-600">
                Describe what needs to be corrected
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                maxLength={1000}
                placeholder="Explain the correction you need…"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
              />
              {state.fieldErrors?.description && (
                <p className="text-xs text-red-500">{state.fieldErrors.description[0]}</p>
              )}
            </div>

            {state.error && (
              <p className="text-xs text-red-500">{state.error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || submittedForms.length === 0}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors min-h-[44px] disabled:opacity-60"
              >
                {isPending ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Open requests list */}
      {initialOpenRequests.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <FaInbox className="text-4xl text-slate-200" />
          <p className="text-sm text-slate-400">No open requests. You&apos;re all good!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {initialOpenRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              style={{ borderLeft: '3px solid #cbd5e1' }}
            >
              <div className="flex items-start gap-4 px-5 py-4">
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <FaPencilAlt className="text-slate-400 text-xs" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 leading-snug truncate">
                      {req.formTitle}
                    </p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[11px] font-medium shrink-0">
                      <FaCircle className="text-[5px]" />
                      Open
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                    {req.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <FaCalendarAlt className="text-slate-300 text-[10px]" />
                    <p className="text-[11px] text-slate-400">Requested {formatDate(req.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
