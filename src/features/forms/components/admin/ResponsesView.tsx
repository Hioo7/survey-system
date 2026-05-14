'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaClipboardList, FaMapMarkerAlt, FaPencilAlt, FaTimes } from 'react-icons/fa'
import { getFormResponsesAction } from '@/features/forms/actions/form-admin.action'
import type { FormDTO } from '@/features/forms/services/form.service'
import type { FormResponseByVersionDTO, FormResponseDTO } from '@/features/forms/services/form-response.service'
import { FIELD_TYPE_LABELS, isInputField } from '@/features/forms/schemas/form-field.types'
import { ResponseEditor } from './ResponseEditor'

type ResponsesViewProps = {
  form: FormDTO
  onBack: () => void
}

export function ResponsesView({ form, onBack }: ResponsesViewProps) {
  type LocationModal = { latitude: number; longitude: number; employeeName: string }

  const [data, setData] = useState<FormResponseByVersionDTO[] | null>(null)
  const [activeVersion, setActiveVersion] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [locationModal, setLocationModal] = useState<LocationModal | null>(null)
  const [editingResponse, setEditingResponse] = useState<FormResponseDTO | null>(null)
  const [isPending, startTransition] = useTransition()

  const fetchData = useCallback(() => {
    startTransition(async () => {
      const result = await getFormResponsesAction(form.id)
      setData(result)
      setActiveVersion(0)
    })
  }, [form.id])

  useEffect(() => { fetchData() }, [fetchData])

  const versionData = data?.[activeVersion]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <FaArrowLeft className="text-sm" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{form.title}</h2>
          <p className="text-sm text-slate-500">Responses</p>
        </div>
      </div>

      {isPending && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-slate-700 animate-spin" />
        </div>
      )}

      {!isPending && data && data.length === 0 && (
        <EmptyState message="No published versions yet. Publish this form first." />
      )}

      {!isPending && data && data.length > 0 && (
        <>
          {/* Version tabs */}
          {data.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {data.map((vd, idx) => (
                <button
                  key={vd.version.id}
                  type="button"
                  onClick={() => {
                    setActiveVersion(idx)
                    setExpandedId(null)
                  }}
                  className={[
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150',
                    idx === activeVersion
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  ].join(' ')}
                >
                  Version {vd.version.versionNumber}
                  <span
                    className={[
                      'ml-2 text-xs px-1.5 py-0.5 rounded-full',
                      idx === activeVersion ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500',
                    ].join(' ')}
                  >
                    {vd.responses.length}
                  </span>
                </button>
              ))}
            </div>
          )}

          {versionData && (
            <>
              {versionData.responses.length === 0 ? (
                <EmptyState message="No responses for this version yet." />
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-slate-500">
                    {versionData.responses.length} response
                    {versionData.responses.length !== 1 ? 's' : ''}
                  </p>
                  {versionData.responses.map((resp) => {
                    const isExpanded = expandedId === resp.id
                    const initial = resp.employeeName.charAt(0).toUpperCase()
                    const inputFields = versionData.version.fields.filter(isInputField)

                    return (
                      <div
                        key={resp.id}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                      >
                        {/* Row header */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setExpandedId(isExpanded ? null : resp.id)}
                          onKeyDown={(e) => e.key === 'Enter' && setExpandedId(isExpanded ? null : resp.id)}
                          className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors min-h-[60px] cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                            {initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {resp.employeeName}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{resp.employeeEmail}</p>
                          </div>
                          <p className="text-xs text-slate-400 shrink-0">
                            {new Date(resp.submittedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setLocationModal({
                                latitude: resp.latitude,
                                longitude: resp.longitude,
                                employeeName: resp.employeeName,
                              })
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                            title="View location"
                          >
                            <FaMapMarkerAlt className="text-xs" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingResponse(resp)
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                            title="Edit response"
                          >
                            <FaPencilAlt className="text-xs" />
                          </button>
                          {isExpanded ? (
                            <FaChevronUp className="text-slate-400 text-xs shrink-0" />
                          ) : (
                            <FaChevronDown className="text-slate-400 text-xs shrink-0" />
                          )}
                        </div>

                        {/* Expanded answers */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 px-5 py-4 flex flex-col gap-4">
                            {inputFields.map((field) => {
                              const answer = resp.answers[field.id]
                              const displayAnswer = Array.isArray(answer)
                                ? answer.join(', ')
                                : (answer ?? '—')
                              return (
                                <div key={field.id} className="flex flex-col gap-1">
                                  <p className="text-xs font-medium text-slate-500">
                                    {field.label ?? FIELD_TYPE_LABELS[field.type]}
                                  </p>
                                  <p className="text-sm text-slate-900">
                                    {displayAnswer || <span className="text-slate-400 italic">No answer</span>}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}
      {editingResponse && versionData && (
        <ResponseEditor
          versionData={versionData.version}
          response={editingResponse}
          formTitle={form.title}
          onBack={() => setEditingResponse(null)}
          onSuccess={() => { setEditingResponse(null); fetchData() }}
        />
      )}
      {locationModal && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-end sm:justify-center"
          onClick={() => setLocationModal(null)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <FaMapMarkerAlt className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {locationModal.employeeName}
                </p>
                <p className="text-xs text-slate-400">
                  {locationModal.latitude.toFixed(5)}, {locationModal.longitude.toFixed(5)}
                </p>
              </div>
            </div>

            {/* Map */}
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${locationModal.latitude},${locationModal.longitude}&zoom=16`}
                width="100%"
                height="320"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Submission location"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[320px] bg-slate-50 gap-2">
                <FaMapMarkerAlt className="text-3xl text-slate-300" />
                <p className="text-sm text-slate-400 text-center px-6">
                  Set <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> to show the map.
                </p>
                <a
                  href={`https://www.google.com/maps?q=${locationModal.latitude},${locationModal.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 underline"
                >
                  Open in Google Maps
                </a>
              </div>
            )}

            {/* Close button */}
            <div className="px-4 py-4 bg-white">
              <button
                type="button"
                onClick={() => setLocationModal(null)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 min-h-[44px] transition-colors"
              >
                <FaTimes className="text-xs" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <FaClipboardList className="text-4xl text-slate-200" />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )
}
