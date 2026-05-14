'use client'

import { useState, useActionState, useEffect, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { FaArrowLeft, FaArrowRight, FaChevronLeft } from 'react-icons/fa'
import { FormPage } from './FormPage'
import { SubmissionConfirmation } from './SubmissionConfirmation'
import { submitFormAction, type SubmitFormActionResult } from '@/features/forms/actions/form-employee.action'
import { isSectionBreak } from '@/features/forms/schemas/form-field.types'
import type { FieldDTO, FormAnswers } from '@/features/forms/schemas/form-field.types'
import type { AssignedFormDTO } from '@/features/forms/services/form-assignment.service'

type FormFillerProps = {
  assignedForm: AssignedFormDTO
  onBack: () => void
}

export function FormFiller({ assignedForm, onBack }: FormFillerProps) {
  const router = useRouter()
  const version = assignedForm.latestVersion!
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<FormAnswers>({})
  const [locationError, setLocationError] = useState<string | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)

  const [state, formAction, isPending] = useActionState<SubmitFormActionResult, FormData>(
    submitFormAction,
    {},
  )
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (state.success) {
      router.refresh()
    }
  }, [state.success, router])

  const pages = useMemo(() => {
    const result: FieldDTO[][] = []
    let current: FieldDTO[] = []
    for (const field of version.fields) {
      if (isSectionBreak(field)) {
        result.push(current)
        current = []
      } else {
        current.push(field)
      }
    }
    result.push(current)
    return result
  }, [version.fields])

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

  if (state.success) {
    return createPortal(
      <div className="fixed inset-0 z-40 bg-slate-50 overflow-y-auto">
        <SubmissionConfirmation formTitle={assignedForm.formTitle} onBack={onBack} />
      </div>,
      document.body,
    )
  }

  if (assignedForm.hasSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
          <span className="text-2xl text-green-500">✓</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Already Submitted</h2>
          <p className="text-sm text-slate-500 mt-1">{assignedForm.formTitle}</p>
          <p className="text-sm text-slate-400 mt-2">
            You have already submitted this version of the form.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[44px]"
        >
          <FaChevronLeft className="text-xs" />
          Back to Forms
        </button>
      </div>
    )
  }

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
          <p className="text-sm font-semibold text-slate-900 truncate">
            {assignedForm.formTitle}
          </p>
          <p className="text-xs text-slate-400">
            Page {currentPage + 1} of {totalPages}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-slate-900 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Form content */}
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (!isLastPage) return

          setLocationError(null)

          if (!navigator.geolocation) {
            setLocationError('Your device does not support location services.')
            return
          }

          setGettingLocation(true)

          const getPosition = () =>
            new Promise<GeolocationPosition>((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                maximumAge: 0,
              })
            )

          try {
            let position: GeolocationPosition
            try {
              position = await getPosition()
            } catch (firstErr) {
              const geoErr = firstErr as GeolocationPositionError
              if (geoErr.code === geoErr.PERMISSION_DENIED) throw firstErr
              // Permission was just granted — browser timed out the triggering call. Retry once.
              position = await getPosition()
            }

            setGettingLocation(false)
            const { latitude, longitude } = position.coords
            const fd = new FormData()
            fd.set('versionId', version.id)
            fd.set('latitude', String(latitude))
            fd.set('longitude', String(longitude))
            Object.entries(answers).forEach(([fieldId, val]) => {
              if (Array.isArray(val)) val.forEach((v) => fd.append(fieldId, v))
              else fd.set(fieldId, val)
            })
            startTransition(() => formAction(fd))
          } catch (err) {
            setGettingLocation(false)
            const geoErr = err as GeolocationPositionError
            if (geoErr.code === geoErr.PERMISSION_DENIED) {
              setLocationError('Location permission is required to submit this form. Please allow location access in your browser and try again.')
            } else {
              setLocationError('Could not determine your location. Please try again.')
            }
          }
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

          {(state.error || locationError) && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-sm text-red-600">
              {locationError ?? state.error}
            </div>
          )}

          {/* Inline navigation — right below the fields */}
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
                key="submit"
                type="submit"
                disabled={gettingLocation || isPending}
                className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 min-h-[44px] transition-colors"
              >
                {gettingLocation ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Getting location…
                  </>
                ) : isPending ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'Submit Form'
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
