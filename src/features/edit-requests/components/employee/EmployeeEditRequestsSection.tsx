'use client'

import { useState, useTransition, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import {
  FaPlus,
  FaTimes,
  FaCircle,
  FaPencilAlt,
  FaChevronDown,
  FaClipboardList,
  FaFileAlt,
  FaAlignLeft,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa'
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
  const [descLength, setDescLength] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [showForm])

  function handleClose() {
    setShowForm(false)
    setFieldState({})
    setDescLength(0)
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createEditRequestAction({}, formData)
      if (result.success) {
        handleClose()
        router.refresh()
      } else {
        setFieldState(result)
      }
    })
  }

  const state = fieldState

  const formSheet = mounted && showForm ? createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Bottom sheet (mobile) / centered modal (sm+) */}
      <div className="fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4 sm:p-6">
        <div className="bg-cream w-full rounded-t-3xl sm:rounded-2xl sm:max-w-lg shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[85vh] overflow-hidden">

          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-0 sm:hidden shrink-0">
            <div className="w-10 h-1 rounded-full bg-foam" />
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 px-5 pt-4 pb-4 sm:pt-5 border-b border-foam shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-espresso flex items-center justify-center shrink-0">
              <FaClipboardList className="text-white text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-roast leading-tight">New Edit Request</h3>
              <p className="text-xs text-cocoa mt-0.5">Tell us what needs to be corrected</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-foam text-cocoa hover:text-mocha hover:bg-vanilla transition-colors shrink-0"
              aria-label="Close"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          {/* Scrollable form body */}
          <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
            <div className="flex flex-col gap-6 px-5 py-5 overflow-y-auto">

              {/* Step 1 — Form selector */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-espresso flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-[10px] font-bold leading-none">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-roast">Select a form</p>
                    <p className="text-xs text-cocoa mt-0.5">Which submission needs a correction?</p>
                  </div>
                </div>

                {submittedForms.length === 0 ? (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-vanilla border border-foam">
                    <FaFileAlt className="text-cocoa shrink-0 mt-0.5" />
                    <p className="text-sm text-cocoa leading-relaxed">
                      You haven&apos;t submitted any forms yet. Complete a form before requesting corrections.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <FaFileAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa text-sm pointer-events-none" />
                    <select
                      id="formId"
                      name="formId"
                      defaultValue=""
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-foam bg-vanilla text-sm text-roast focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel min-h-[48px] appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Choose a form…</option>
                      {submittedForms.map((f) => (
                        <option key={f.formId} value={f.formId}>{f.formTitle}</option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cocoa text-xs pointer-events-none" />
                  </div>
                )}

                {state.fieldErrors?.formId && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500">
                    <FaExclamationCircle className="shrink-0" />
                    {state.fieldErrors.formId[0]}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-foam -mx-5" />

              {/* Step 2 — Description */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-espresso flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-[10px] font-bold leading-none">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-roast">Describe the correction</p>
                    <p className="text-xs text-cocoa mt-0.5">Be specific — include field names and correct values</p>
                  </div>
                </div>

                <div className="relative">
                  <FaAlignLeft className="absolute left-3.5 top-3.5 text-cocoa text-xs pointer-events-none" />
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    maxLength={1000}
                    placeholder="e.g. My date of joining was entered incorrectly — it should be Jan 15, 2023, not Jan 5, 2023."
                    onChange={(e) => setDescLength(e.target.value.length)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-foam bg-vanilla text-sm text-roast placeholder:text-cocoa/60 focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel resize-none"
                  />
                </div>

                <div className="flex items-start justify-between gap-2">
                  {state.fieldErrors?.description ? (
                    <div className="flex items-center gap-1.5 text-xs text-red-500">
                      <FaExclamationCircle className="shrink-0" />
                      {state.fieldErrors.description[0]}
                    </div>
                  ) : (
                    <p className="text-xs text-cocoa">Tip: More detail helps us resolve it faster</p>
                  )}
                  <span className={[
                    'text-xs tabular-nums shrink-0 font-medium',
                    descLength > 900 ? 'text-amber-600' : 'text-cocoa',
                  ].join(' ')}>
                    {descLength}/1000
                  </span>
                </div>
              </div>

              {state.error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100 text-sm text-red-600">
                  <FaExclamationCircle className="shrink-0" />
                  {state.error}
                </div>
              )}
            </div>

            {/* Sticky footer */}
            <div className="shrink-0 px-5 py-4 border-t border-foam bg-cream flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-xl border border-foam text-sm font-medium text-cocoa hover:bg-vanilla active:bg-foam transition-colors min-h-[48px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || submittedForms.length === 0}
                className="flex-1 px-4 py-3 rounded-xl bg-espresso text-white text-sm font-semibold hover:bg-mocha active:bg-caramel-burnt transition-colors min-h-[48px] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <FaClipboardList className="text-xs shrink-0" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body,
  ) : null

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-roast">Edit Requests</h2>
          <p className="text-sm text-cocoa mt-0.5">Request a correction on your submission</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso text-white text-sm font-medium hover:bg-mocha active:bg-caramel-burnt transition-colors min-h-[44px] shrink-0"
        >
          <FaPlus className="text-xs" />
          <span className="hidden sm:inline">New Request</span>
        </button>
      </div>

      {formSheet}

      {/* Open requests list */}
      {initialOpenRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-vanilla border border-foam flex items-center justify-center">
            <FaCheckCircle className="text-2xl text-cocoa" />
          </div>
          <div>
            <p className="text-sm font-semibold text-mocha">All caught up!</p>
            <p className="text-xs text-cocoa mt-1 max-w-[200px] leading-relaxed">
              No open requests. Tap &quot;New Request&quot; if something needs correcting.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {initialOpenRequests.map((req) => (
            <div
              key={req.id}
              className="bg-cream rounded-2xl border border-foam shadow-sm overflow-hidden"
              style={{ borderLeft: '3px solid #C89B6D' }}
            >
              <div className="flex items-start gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-vanilla border border-foam flex items-center justify-center shrink-0 mt-0.5">
                  <FaPencilAlt className="text-mocha text-sm" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-roast leading-snug">
                      {req.formTitle}
                    </p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[11px] font-medium shrink-0">
                      <FaCircle className="text-[5px]" />
                      Open
                    </span>
                  </div>
                  <p className="text-sm text-cocoa mt-1.5 leading-relaxed line-clamp-3">
                    {req.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <FaClock className="text-caramel text-[10px]" />
                    <p className="text-[11px] text-cocoa">Requested {formatDate(req.createdAt)}</p>
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
