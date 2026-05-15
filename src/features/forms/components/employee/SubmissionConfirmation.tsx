'use client'

import { FaCheckCircle } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'

type SubmissionConfirmationProps = {
  formTitle: string
  onBack: () => void
}

export function SubmissionConfirmation({ formTitle, onBack }: SubmissionConfirmationProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-gold-light flex items-center justify-center">
        <FaCheckCircle className="text-4xl text-gold-dark" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-roast">Form Submitted!</h2>
        <p className="text-sm text-cocoa mt-1">{formTitle}</p>
      </div>
      <p className="text-sm text-cocoa max-w-xs">
        Your response has been recorded. Thank you for completing this form.
      </p>
      <Button type="button" variant="secondary" onClick={onBack}>
        Back to Forms
      </Button>
    </div>
  )
}
