'use client'

import { FaClipboardList } from 'react-icons/fa'

export function EmployeeFormSection() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Survey Forms</h1>
        <p className="text-slate-500 text-sm mt-1">Forms assigned to you</p>
      </div>

      <div className="flex flex-col items-center py-20 text-center gap-5">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center">
          <FaClipboardList className="text-slate-400 text-3xl" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-semibold text-slate-800 text-lg">Survey Forms Coming Soon</h3>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            Forms assigned to you will appear here.
          </p>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  )
}
