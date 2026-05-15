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
        <h2 className="text-xl font-semibold text-roast">Edit Requests</h2>
        <p className="text-sm text-cocoa mt-0.5">
          Correction requests raised by employees
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as 'open' | 'closed')} />

      {activeTab === 'open' && (
        <>
          {openRequests.length === 0 ? (
            <EmptyState
              icon={<FaInbox className="text-4xl text-foam" />}
              message="No open requests. All caught up!"
            />
          ) : (
            <div className="flex flex-col gap-3">
              {openRequests.map((req) => (
                <RequestCard key={req.id}>
                  <RequestCardHeader req={req} />
                  <p className="text-sm text-mocha leading-relaxed line-clamp-3 mt-1">
                    {req.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-foam">
                    <p className="text-xs text-cocoa">{formatDate(req.createdAt)}</p>
                    <button
                      type="button"
                      onClick={() => handleClose(req.id)}
                      disabled={isPending && closingId === req.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-dark text-white text-sm font-medium hover:bg-gold active:bg-gold-dark transition-colors min-h-[44px] disabled:opacity-60"
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
              icon={<FaArchive className="text-4xl text-foam" />}
              message="No closed requests yet."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {closedRequests.map((req) => (
                <RequestCard key={req.id}>
                  <RequestCardHeader req={req} />
                  <p className="text-sm text-mocha leading-relaxed line-clamp-3 mt-1">
                    {req.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-foam">
                    <p className="text-xs text-cocoa">
                      Opened {formatDate(req.createdAt)}
                    </p>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-light text-gold-dark text-xs font-medium">
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
    <div className="bg-cream rounded-2xl border border-foam shadow-sm px-5 py-4">
      {children}
    </div>
  )
}

function RequestCardHeader({ req }: { req: EditRequestDTO }) {
  const initial = req.employeeName.charAt(0).toUpperCase()
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-espresso text-white flex items-center justify-center text-sm font-semibold shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-roast truncate">{req.employeeName}</p>
        <p className="text-xs text-cocoa truncate">{req.employeeEmail}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs text-cocoa font-medium truncate max-w-[120px]">{req.formTitle}</p>
      </div>
    </div>
  )
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      {icon}
      <p className="text-sm text-cocoa">{message}</p>
    </div>
  )
}
