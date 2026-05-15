import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { z } from 'zod'
import { verifyToken } from '@/lib/jwt'
import { getFormById } from '@/features/forms/services/form.service'
import { getExportDataForVersion } from '@/features/forms/services/form-response.service'
import { isInputField, FIELD_TYPE_LABELS } from '@/features/forms/schemas/form-field.types'

const querySchema = z.object({
  versionId: z.string().min(1),
})

function toFileSafeSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('staff_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { formId } = await params

  const { searchParams } = request.nextUrl
  const parsed = querySchema.safeParse({ versionId: searchParams.get('versionId') })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Missing or invalid versionId' }, { status: 400 })
  }

  const [form, exportData] = await Promise.all([
    getFormById(formId),
    getExportDataForVersion(parsed.data.versionId),
  ])

  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  if (!exportData) return NextResponse.json({ error: 'Version not found' }, { status: 404 })

  const { version, responses } = exportData
  const inputFields = version.fields.filter(isInputField)

  const headers = [
    'Employee Name',
    'Employee Email',
    'Submitted At',
    ...inputFields.map((f) => f.label ?? FIELD_TYPE_LABELS[f.type]),
  ]

  const rows = responses.map((resp) => [
    resp.employeeName,
    resp.employeeEmail,
    new Date(resp.submittedAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    ...inputFields.map((field) => {
      const answer = resp.answers[field.id]
      if (Array.isArray(answer)) return answer.join(', ')
      return answer ?? ''
    }),
  ])

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, `Version ${version.versionNumber}`)

  const slug = toFileSafeSlug(form.title)
  const date = new Date().toISOString().slice(0, 10)
  const filename = `${slug}-v${version.versionNumber}-${date}.xlsx`

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
