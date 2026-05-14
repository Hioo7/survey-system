'use client'

import { useState, useActionState, useEffect, useMemo, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { FaArrowLeft, FaArrowRight, FaChevronLeft, FaSave } from 'react-icons/fa'
import { FormPage } from '../employee/FormPage'
import {
  updateFormResponseAction,
  type UpdateFormResponseActionResult,
} from '@/features/forms/actions/form-admin.action'
import { isSectionBreak } from '@/features/forms/schemas/form-field.types'
import type { FieldDTO, FormAnswers } from '@/features/forms/schemas/form-field.types'
import type { FormVersionDTO } from '@/features/forms/services/form-version.service'
import type { FormResponseDTO } from '@/features/forms/services/form-response.service'

type ResponseEditorProps = {
  versionData: FormVersionDTO
  response: FormResponseDTO
  formTitle: string
  onBack: () => void
  onSuccess: () => void
}

export function ResponseEditor({
  versionData,
  response,
  formTitle,
  onBack,
  onSuccess,
}: ResponseEditorProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<FormAnswers>(() => ({ ...response.answers }))

  const [state, formAction, isPending] = useActionState<UpdateFormResponseActionResult, FormData>(
    updateFormResponseAction,
    {},
  )
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (state.success) {
      onSuccess()
    }
  }, [state.success, onSuccess])

  const pages = useMemo(() => {
    const result: FieldDTO[][] = []
    let current: FieldDTO[] = []
    for (const field of versionData.fields) {
      if (isSectionBreak(field)) {
        result.push(current)
        current = []
      } else {
        current.push(field)
      }
    }
    result.push(current)
    return result
  }, [versionData.fields])

  const totalPages = pages.length
  const currentFields = pages[currentPage] ?? []
  const isLastPage = currentPage === totalPages - 1
  const progress = ((currentPage + 1) / totalPages) * 100

  const handleChange = (fieldId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }))
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-40 bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 shrink-0"
        >
          <FaChevronLeft className="text-sm" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{formTitle}</p>
          <p className="text-xs text-amber-600 font-medium truncate">
            Editing: {response.employeeName} · Page {currentPage + 1} of {totalPages}
          </p>
        </div>
      </div>

      {/* Progress bar — amber to signal edit mode */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Form content */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!isLastPage) return
          const fd = new FormData()
          fd.set('responseId', response.id)
          fd.set('versionId', versionData.id)
          Object.entries(answers).forEach(([fieldId, val]) => {
            if (Array.isArray(val)) val.forEach((v) => fd.append(fieldId, v))
            else fd.set(fieldId, val)
          })
          startTransition(() => formAction(fd))
        }}
        className="flex flex-col"
      >
        <div className="px-4 sm:px-6 py-6 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <FormPage
              fields={currentFields}
              answers={answers}
              onChange={handleChange}
              fieldErrors={state.fieldErrors}
            />
          </div>

          {state.error && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-sm text-red-600">
              {state.error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3 pt-2">
            {currentPage > 0 && (
              <button
                type="button"
                onClick={() => setCurrentPage((p) => p - 1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[44px]"
              >
                <FaArrowLeft className="text-xs" />
                Previous
              </button>
            )}

            {!isLastPage ? (
              <button
                key="next"
                type="button"
                onClick={() => setCurrentPage((p) => p + 1)}
                className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 min-h-[44px] transition-colors"
              >
                Next
                <FaArrowRight className="text-xs" />
              </button>
            ) : (
              <button
                key="update"
                type="submit"
                disabled={isPending}
                className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 min-h-[44px] transition-colors"
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Updating…
                  </>
                ) : (
                  <>
                    <FaSave className="text-xs" />
                    Update Response
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>,
    document.body,
  )
}
