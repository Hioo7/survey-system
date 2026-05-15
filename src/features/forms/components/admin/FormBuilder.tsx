'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import {
  FaArrowLeft,
  FaRocket,
  FaSave,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { FieldList } from './FieldList'
import { FieldEditor } from './FieldEditor'
import { FormPreview } from './FormPreview'
import { FieldTypePicker } from './FieldTypePicker'
import { PublishConfirmModal } from './PublishConfirmModal'
import {
  createFormAction,
  updateFormDraftAction,
} from '@/features/forms/actions/form-admin.action'
import { defaultFieldForType } from '@/features/forms/schemas/form-field.types'
import type { FieldDTO, FieldType } from '@/features/forms/schemas/form-field.types'
import type { FormDTO } from '@/features/forms/services/form.service'

type FormBuilderProps = {
  form: FormDTO | null
  onClose: () => void
  onSaved: () => void
}

type MobileTab = 'fields' | 'edit' | 'preview'

export function FormBuilder({ form, onClose, onSaved }: FormBuilderProps) {
  const router = useRouter()

  const [formId, setFormId] = useState<string | null>(form?.id ?? null)
  const [title, setTitle] = useState(form?.title ?? '')
  const [description, setDescription] = useState(form?.description ?? '')
  const [fields, setFields] = useState<FieldDTO[]>(form?.fields ?? [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTypePicker, setShowTypePicker] = useState(false)
  const [showPublish, setShowPublish] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('fields')
  const [isPending, startTransition] = useTransition()

  const markDirty = () => setIsDirty(true)

  const handleTitleChange = (v: string) => {
    setTitle(v)
    markDirty()
  }
  const handleDescChange = (v: string) => {
    setDescription(v)
    markDirty()
  }

  const handleFieldChange = (updated: FieldDTO) => {
    setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
    markDirty()
  }

  const handleAddField = (type: FieldType) => {
    const id = crypto.randomUUID()
    const newField: FieldDTO = {
      id,
      ...defaultFieldForType(type, fields.length),
    }
    setFields((prev) => [...prev, newField])
    setSelectedId(id)
    setMobileTab('edit')
    markDirty()
  }

  const handleMove = (id: string, dir: 'up' | 'down') => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id)
      if (idx === -1) return prev
      const next = [...prev]
      if (dir === 'up' && idx > 0) {
        ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      } else if (dir === 'down' && idx < next.length - 1) {
        ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      }
      return next.map((f, i) => ({ ...f, order: i }))
    })
    markDirty()
  }

  const handleDelete = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id).map((f, i) => ({ ...f, order: i })))
    if (selectedId === id) setSelectedId(null)
    markDirty()
  }

  const handleSave = () => {
    if (!title.trim()) {
      setError('Form title is required')
      return
    }
    setError(null)

    startTransition(async () => {
      const fd = new FormData()
      if (formId) fd.append('id', formId)
      fd.append('title', title.trim())
      fd.append('description', description)
      fd.append('fields', JSON.stringify(fields))

      const result = formId
        ? await updateFormDraftAction({}, fd)
        : await createFormAction({}, fd)

      if (result.success) {
        if (!formId && result.formId) setFormId(result.formId)
        setIsDirty(false)
        onSaved()
        router.refresh()
      } else {
        setError(result.error ?? 'Failed to save')
      }
    })
  }

  const selectedField = fields.find((f) => f.id === selectedId) ?? null

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const builderContent = (
    <div className="fixed inset-0 z-40 bg-cream flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 bg-cream border-b border-foam px-4 sm:px-6 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-foam text-cocoa hover:bg-vanilla transition-colors shrink-0"
        >
          <FaArrowLeft className="text-sm" />
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled Form"
            className="w-full text-base font-semibold text-roast bg-transparent border-none outline-none placeholder:text-foam truncate"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => handleDescChange(e.target.value)}
            placeholder="Add a description…"
            className="w-full text-xs text-cocoa bg-transparent border-none outline-none placeholder:text-foam mt-0.5"
          />
        </div>

        {isDirty && (
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
        )}

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-foam text-sm font-medium text-mocha hover:bg-vanilla disabled:opacity-50 min-h-[44px] transition-colors"
          >
            <FaSave className="text-sm" />
            {isPending ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-foam text-cocoa hover:bg-vanilla disabled:opacity-50"
          >
            <FaSave className="text-sm" />
          </button>
          {formId && (
            <button
              type="button"
              onClick={() => setShowPublish(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-espresso text-white text-sm font-medium hover:bg-mocha min-h-[44px] transition-colors"
            >
              <FaRocket className="text-sm" />
              <span className="hidden sm:inline">Publish</span>
            </button>
          )}
        </div>
      </div>

      {/* Error bar */}
      {error && (
        <div className="shrink-0 flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-red-50 border-b border-red-100 text-sm text-red-600">
          <FaExclamationTriangle className="shrink-0" />
          {error}
        </div>
      )}

      {/* Mobile tab bar */}
      <div className="shrink-0 lg:hidden flex border-b border-foam">
        {(['fields', 'edit', 'preview'] as MobileTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMobileTab(tab)}
            className={[
              'flex-1 py-3 text-sm font-medium capitalize transition-colors relative',
              mobileTab === tab ? 'text-roast' : 'text-cocoa hover:text-mocha',
            ].join(' ')}
          >
            {mobileTab === tab && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-espresso rounded-full" />
            )}
            {tab === 'edit' ? 'Editor' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Field list */}
        <div
          className={[
            'border-r border-foam overflow-hidden',
            'lg:w-64 lg:flex lg:flex-col',
            mobileTab === 'fields' ? 'flex flex-col w-full' : 'hidden',
          ].join(' ')}
        >
          <FieldList
            fields={fields}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id)
              setMobileTab('edit')
            }}
            onMove={handleMove}
            onDelete={handleDelete}
            onAddField={() => setShowTypePicker(true)}
          />
        </div>

        {/* CENTER: Field editor */}
        <div
          className={[
            'flex-1 overflow-y-auto',
            'lg:flex lg:flex-col',
            mobileTab === 'edit' ? 'flex flex-col w-full' : 'hidden',
          ].join(' ')}
        >
          {selectedField ? (
            <FieldEditor
              field={selectedField}
              onChange={handleFieldChange}
              onChangeType={() => setShowTypePicker(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="text-sm text-cocoa">Select a field to edit it</p>
              <p className="text-xs text-foam mt-1">
                Or add a new field using the button in the Fields panel
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: Preview */}
        <div
          className={[
            'bg-vanilla border-l border-foam overflow-hidden',
            'lg:w-72 lg:flex lg:flex-col',
            mobileTab === 'preview' ? 'flex flex-col w-full' : 'hidden',
          ].join(' ')}
        >
          <FormPreview fields={fields} formTitle={title} />
        </div>
      </div>

      {/* Modals */}
      <FieldTypePicker
        isOpen={showTypePicker}
        onClose={() => setShowTypePicker(false)}
        onSelect={(type: FieldType) => handleAddField(type)}
      />

      {formId && (
        <PublishConfirmModal
          isOpen={showPublish}
          onClose={() => setShowPublish(false)}
          form={
            {
              id: formId,
              title,
              description,
              status: form?.status ?? 'DRAFT',
              fields,
              createdAt: form?.createdAt ?? new Date().toISOString(),
              updatedAt: form?.updatedAt ?? new Date().toISOString(),
              _count: form?._count ?? { assignments: 0, versions: 0 },
            } as FormDTO
          }
          onPublished={() => {
            onSaved()
            router.refresh()
            onClose()
          }}
        />
      )}
    </div>
  )

  if (!mounted) return null
  return createPortal(builderContent, document.body)
}
