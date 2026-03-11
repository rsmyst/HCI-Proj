'use client'

const BOOKING_STEPS = ['Search Trains', 'Select Train', 'Passenger Details', 'Review & Pay']

export default function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center w-full max-w-2xl mx-auto">
      {BOOKING_STEPS.map((step, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isCurrent = stepNum === currentStep

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-200',
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isCurrent
                    ? 'bg-[#1a3c6e] border-[#1a3c6e] text-white dark:bg-blue-700 dark:border-blue-700'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400',
                ].join(' ')}
              >
                {isCompleted ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                  isCurrent
                    ? 'text-[#1a3c6e] dark:text-blue-300'
                    : isCompleted
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>

            {i < BOOKING_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 transition-colors duration-300 ${
                  isCompleted ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
