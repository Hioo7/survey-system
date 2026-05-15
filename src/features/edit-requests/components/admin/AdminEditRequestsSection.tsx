'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaInbox,
  FaArchive,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa'
import { Tabs } from '@/components/ui/Tabs'
import { closeEditRequestAction } from '@/features/edit-requests/actions/edit-request.action'
import type { EditRequestDTO } from '@/features/edit-requests/services/edit-request.service'

type Props = {
  initialOpenRequests: EditRequestDTO[]
  initialClosedRequests: EditRequestDTO[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function AdminEditRequestsSection({ initialOpenRequests, initialClosedRequests }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')
  const [closingId, setClosingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const openRequests = initialOpenRequests
  const closedRequests = initialClosedRequests

  function handleClose(id: string) {
    setClosingId(id)
    startTransition(async () => {
      await closeEditRequestAction(id)
      router.refresh()
      setClosingId(null)
    })
  }

  const tabs = [
    {
      id: 'open',
      label: `Open${openRequests.length > 0 ? ` (${openRequests.length})` : ''}`,
      icon: <FaExclamationCircle />,
    },
    {
      id: 'closed',
      label: 'Closed',
      icon: <FaArchive />,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Edit Requests</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Correction requests raised by employees
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as 'open' | 'closed')} />

      {activeTab === 'open' && (
        <>
          {openRequests.length === 0 ? (
            <EmptyState
              icon={<FaInbox className="text-4xl text-slate-200" />}
              message="No open requests. All caught up!"
            />
          ) : (
            <div className="flex flex-col gap-3">
              {openRequests.map((req) => (
                <RequestCard key={req.id}>
                  <RequestCardHeader req={req} />
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-3 mt-1">
                    {req.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400">{formatDate(req.createdAt)}</p>
                    <button
                      type="button"
                      onClick={() => handleClose(req.id)}
                      disabled={isPending && closingId === req.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors min-h-[44px] disabled:opacity-60"
                    >
                      <FaCheckCircle className="text-xs shrink-0" />
                      {isPending && closingId === req.id ? 'Resolving…' : 'Mark Resolved'}
                    </button>
                  </div>
                </RequestCard>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'closed' && (
        <>
          {closedRequests.length === 0 ? (
            <EmptyState
              icon={<FaArchive className="text-4xl text-slate-200" />}
              message="No closed requests yet."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {closedRequests.map((req) => (
                <RequestCard key={req.id}>
                  <RequestCardHeader req={req} />
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-3 mt-1">
                    {req.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                      Opened {formatDate(req.createdAt)}
                    </p>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                      <FaCheckCircle className="text-[10px]" />
                      Resolved {req.closedAt ? formatDate(req.closedAt) : ''}
                    </span>
                  </div>
                </RequestCard>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function RequestCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
      {children}
    </div>
  )
}

function RequestCardHeader({ req }: { req: EditRequestDTO }) {
  const initial = req.employeeName.charAt(0).toUpperCase()
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{req.employeeName}</p>
        <p className="text-xs text-slate-400 truncate">{req.employeeEmail}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs text-slate-500 font-medium truncate max-w-[120px]">{req.formTitle}</p>
      </div>
    </div>
  )
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      {icon}
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )
}
