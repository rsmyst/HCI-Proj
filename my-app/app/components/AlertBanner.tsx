'use client'

import { useState } from 'react'

type Alert = {
  title: string
  message: string
  tone?: 'warning' | 'info'
}

export default function AlertBanner({ alert }: { alert?: Alert }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !alert) return null

  return (
    <div
      className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/50 px-4 py-2 flex items-center justify-center gap-4 text-sm text-amber-800 dark:text-amber-300 transition-colors duration-300"
      role="status"
      aria-live="polite"
    >
      <svg className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
      <span>
        <strong>{alert.title}:</strong> {alert.message}
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-2 text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 font-medium underline shrink-0 transition-colors duration-150"
      >
        Dismiss
      </button>
    </div>
  )
}
