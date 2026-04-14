'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import ProgressStepper from '../components/ProgressStepper'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PassengerErrors {
  name?: string
  age?: string
  gender?: string
}

interface PassengerTouched {
  name?: boolean
  age?: boolean
  gender?: boolean
}

interface Passenger {
  id: number
  name: string
  age: string
  gender: string
  berth: string
  errors: PassengerErrors
  touched: PassengerTouched
}

// ─── Validation helpers ───────────────────────────────────────────────────────

function validateName(v: string): string {
  if (!v.trim()) return 'Name is required'
  if (v.trim().length < 3) return 'Name must be at least 3 characters'
  if (v.trim().length > 16) return 'Name must be at most 16 characters'
  return ''
}

function validateAge(v: string): string {
  const n = parseInt(v, 10)
  if (!v) return 'Age is required'
  if (isNaN(n) || n < 1 || n > 125) return 'Enter a valid age (1–125)'
  return ''
}

function validateGender(v: string): string {
  if (!v) return 'Please select a gender'
  return ''
}

// ─── Passenger Card ───────────────────────────────────────────────────────────

function PassengerCard({
  passenger,
  index,
  onUpdate,
  onBlurField,
  onRemove,
  showRemove,
}: {
  passenger: Passenger
  index: number
  onUpdate: (id: number, field: keyof Pick<Passenger, 'name' | 'age' | 'gender' | 'berth'>, value: string) => void
  onBlurField: (id: number, field: 'name' | 'age' | 'gender') => void
  onRemove: (id: number) => void
  showRemove: boolean
}) {
  const fieldClass = (hasError: boolean) =>
    [
      'w-full border rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100',
      'bg-white dark:bg-gray-700 placeholder-gray-400',
      'focus:outline-none focus:ring-2 transition duration-150',
      hasError
        ? 'border-red-400 focus:ring-red-400'
        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent',
    ].join(' ')

  const BERTH_OPTIONS = ['No Preference', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper']

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4 animate-fade-in-up">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
          Passenger {index + 1}
        </h4>

        {/* Trash icon (Fitts's Law fix — replaces tiny grey ×) */}
        {showRemove && (
          <button
            onClick={() => onRemove(passenger.id)}
            aria-label={`Remove passenger ${index + 1}`}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Full Name — stacked on its own row (Gestalt Proximity fix) ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
          {/* Tooltip hint to prevent error before it happens — Nielsen's #5 */}
          <span className="ml-1.5 text-xs text-gray-400 font-normal">(3–16 characters)</span>
        </label>
        <input
          type="text"
          value={passenger.name}
          onChange={(e) => onUpdate(passenger.id, 'name', e.target.value)}
          onBlur={() => onBlurField(passenger.id, 'name')}
          placeholder="Enter passenger's full name"
          maxLength={16}
          className={fieldClass(!!(passenger.errors.name && passenger.touched.name))}
        />
        {/* Error shown only after blur — Nielsen's #9 fix */}
        {passenger.errors.name && passenger.touched.name && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 shrink-0">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
            </svg>
            {passenger.errors.name}
          </p>
        )}
      </div>

      {/* ── Age + Gender — side by side (natural pairing) ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
          <input
            type="number"
            value={passenger.age}
            onChange={(e) => onUpdate(passenger.id, 'age', e.target.value)}
            onBlur={() => onBlurField(passenger.id, 'age')}
            placeholder="Age"
            min={1}
            max={125}
            className={fieldClass(!!(passenger.errors.age && passenger.touched.age))}
          />
          {passenger.errors.age && passenger.touched.age && (
            <p className="mt-1.5 text-xs text-red-500">{passenger.errors.age}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
          <select
            value={passenger.gender}
            onChange={(e) => onUpdate(passenger.id, 'gender', e.target.value)}
            onBlur={() => onBlurField(passenger.id, 'gender')}
            className={fieldClass(!!(passenger.errors.gender && passenger.touched.gender))}
          >
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="T">Transgender</option>
          </select>
          {passenger.errors.gender && passenger.touched.gender && (
            <p className="mt-1.5 text-xs text-red-500">{passenger.errors.gender}</p>
          )}
        </div>
      </div>

      {/* ── Berth Preference — button group (replaces cramped dropdown) ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Berth Preference
        </label>
        <div className="flex flex-wrap gap-2">
          {BERTH_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onUpdate(passenger.id, 'berth', opt)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
                passenger.berth === opt
                  ? 'bg-[#1a3c6e] text-white border-[#1a3c6e] dark:bg-blue-700 dark:border-blue-700 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-[#1a3c6e] hover:text-[#1a3c6e] dark:hover:border-blue-400',
              ].join(' ')}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Payment Mode Section ─────────────────────────────────────────────────────
// Grouped with icons — Miller's Law fix (replaces one long slash-separated string)

const PAYMENT_METHODS = [
  {
    id: 'cards',
    label: 'Credit & Debit Cards',
    subLabel: 'Visa · Mastercard · RuPay · EMI options',
    fee: '₹15 + GST',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    subLabel: 'All major Indian banks supported',
    fee: '₹15 + GST',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <line x1="3" y1="22" x2="21" y2="22" />
        <line x1="6" y1="18" x2="6" y2="11" />
        <line x1="10" y1="18" x2="10" y2="11" />
        <line x1="14" y1="18" x2="14" y2="11" />
        <line x1="18" y1="18" x2="18" y2="11" />
        <polygon points="12 2 20 7 4 7" />
      </svg>
    ),
  },
  {
    id: 'upi',
    label: 'UPI / BHIM UPI',
    subLabel: 'Google Pay · PhonePe · BHIM · Paytm UPI',
    fee: '₹10 + GST',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'wallets',
    label: 'Wallets & Rewards',
    subLabel: 'Paytm Wallet · Amazon Pay · IRCTC eWallet',
    fee: '₹15 + GST',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M20 12V7H4a2 2 0 000 4h16v1" />
        <path d="M20 12v5H4a2 2 0 01-2-2v-3" />
        <circle cx="17" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
]

function PaymentModeSection({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Payment method">
      {PAYMENT_METHODS.map((m) => {
        const isSelected = selected === m.id
        return (
          <label
            key={m.id}
            className={[
              'flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-150',
              isSelected
                ? 'border-[#1a3c6e] bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20 shadow-sm'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600',
            ].join(' ')}
          >
            <input
              type="radio"
              name="payment"
              value={m.id}
              checked={isSelected}
              onChange={() => onSelect(m.id)}
              className="sr-only"
            />

            {/* Icon container */}
            <div
              className={[
                'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                isSelected
                  ? 'bg-[#1a3c6e] text-white dark:bg-blue-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
              ].join(' ')}
            >
              {m.icon}
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{m.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{m.subLabel}</div>
            </div>

            {/* Fee */}
            <div className="text-xs text-gray-400 dark:text-gray-500 shrink-0 text-right">
              <span className="block">Conv. fee</span>
              <span className="block font-medium text-gray-700 dark:text-gray-300">{m.fee}</span>
            </div>

            {/* Radio circle */}
            <div
              className={[
                'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                isSelected
                  ? 'border-[#1a3c6e] dark:border-blue-500'
                  : 'border-gray-300 dark:border-gray-600',
              ].join(' ')}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#1a3c6e] dark:bg-blue-500" />
              )}
            </div>
          </label>
        )
      })}
    </div>
  )
}

// ─── Booking content (needs Suspense for useSearchParams) ─────────────────────

function BookingContent() {
  const params = useSearchParams()

  // Read query params from search page navigation
  const trainName  = params.get('name')  ?? 'PANCHAGANGA EXP'
  const trainNum   = params.get('train') ?? '16596'
  const classCode  = params.get('class') ?? 'SL'
  const basePrice  = parseInt(params.get('price') ?? '310', 10)
  const fromStn    = params.get('from')  ?? 'SURATHKAL'
  const toStn      = params.get('to')    ?? 'KSR BENGALURU'
  const journeyDate = params.get('date') ?? 'Fri, 13 Mar'
  const journeyDateISO = params.get('dateISO') ?? ''
  const depTime    = params.get('dep')   ?? '21:56'
  const arrTime    = params.get('arr')   ?? '07:15'
  const duration   = params.get('dur')   ?? '9h 19m'
  const searchHref = `/search?${new URLSearchParams({
    from: fromStn,
    to: toStn,
    date: journeyDateISO,
    class: classCode,
    quota: 'General',
  }).toString()}`

  const CLASS_LABELS: Record<string, string> = {
    SL: 'Sleeper (SL)',
    '3A': 'AC 3 Tier (3A)',
    '2A': 'AC 2 Tier (2A)',
    '1A': 'AC First Class (1A)',
    '3E': 'AC 3 Economy (3E)',
  }

  // ── State ──────────────────────────────────────────────────────────────────

  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: 1, name: '', age: '', gender: '', berth: 'No Preference', errors: {}, touched: {} },
  ])
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [autoUpgrade, setAutoUpgrade]     = useState(false)
  const [contactNumber, setContactNumber] = useState('')
  const router = useRouter()

  // ── Fare calculation ───────────────────────────────────────────────────────

  const CONV_FEES: Record<string, number> = {
    cards: 15, netbanking: 15, upi: 10, wallets: 15,
  }
  const convFee    = CONV_FEES[paymentMethod] ?? 15
  const gst        = Math.round(convFee * 0.18)
  const ticketFare = basePrice * passengers.length
  const grandTotal = ticketFare + convFee + gst

  // ── Passenger handlers ─────────────────────────────────────────────────────

  const updatePassenger = (
    id: number,
    field: keyof Pick<Passenger, 'name' | 'age' | 'gender' | 'berth'>,
    value: string,
  ) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id !== id ? p : { ...p, [field]: value })),
    )
  }

  const blurPassengerField = (id: number, field: 'name' | 'age' | 'gender') => {
    setPassengers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const val   = p[field]
        const error =
          field === 'name'   ? validateName(val)   :
          field === 'age'    ? validateAge(val)     :
          validateGender(val)
        return {
          ...p,
          touched: { ...p.touched, [field]: true },
          errors:  { ...p.errors,  [field]: error },
        }
      }),
    )
  }

  const addPassenger = () => {
    if (passengers.length >= 6) return
    setPassengers((prev) => [
      ...prev,
      { id: Date.now(), name: '', age: '', gender: '', berth: 'No Preference', errors: {}, touched: {} },
    ])
  }

  const removePassenger = (id: number) => {
    setPassengers((prev) => prev.filter((p) => p.id !== id))
  }

  // ── Proceed to Review & Pay ────────────────────────────────────────────────

  const handleProceed = () => {
    // Touch + validate all passenger fields
    let hasErrors = false
    setPassengers((prev) =>
      prev.map((p) => {
        const nameErr   = validateName(p.name)
        const ageErr    = validateAge(p.age)
        const genderErr = validateGender(p.gender)
        if (nameErr || ageErr || genderErr) hasErrors = true
        return {
          ...p,
          touched: { name: true, age: true, gender: true },
          errors:  { name: nameErr, age: ageErr, gender: genderErr },
        }
      })
    )
    if (hasErrors) {
      // Scroll to first error
      setTimeout(() => {
        document.querySelector('[aria-invalid="true"], .border-red-400')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }

    // Build review params
    const reviewParams = new URLSearchParams()
    reviewParams.set('train', trainNum)
    reviewParams.set('name', trainName)
    reviewParams.set('class', classCode)
    reviewParams.set('price', String(basePrice))
    reviewParams.set('from', fromStn)
    reviewParams.set('to', toStn)
    reviewParams.set('date', journeyDate)
    reviewParams.set('dateISO', journeyDateISO)
    reviewParams.set('dep', depTime)
    reviewParams.set('arr', arrTime)
    reviewParams.set('dur', duration)
    reviewParams.set('payment', paymentMethod)
    reviewParams.set('total', String(grandTotal))
    reviewParams.set('convFee', String(convFee))
    reviewParams.set('gst', String(gst))
    reviewParams.set('contact', contactNumber)
    reviewParams.set('passengers', JSON.stringify(
      passengers.map((p) => ({ name: p.name, age: p.age, gender: p.gender, berth: p.berth }))
    ))
    router.push(`/review?${reviewParams.toString()}`)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link
          href={searchHref}
          className="rounded-lg border border-[#1a3c6e] bg-white px-4 py-2 text-sm font-semibold text-[#1a3c6e] hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-300 dark:hover:bg-gray-800 transition-colors"
        >
          Search trains
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg bg-[#1a3c6e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#214b86] transition-colors"
        >
          Dashboard
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ════════════════════════════════════════════
            LEFT — Main form content
            ════════════════════════════════════════════ */}
        <div className="flex-1 space-y-5 min-w-0">

          {/* Journey Summary */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-start justify-between mb-4 gap-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {trainName}&nbsp;
                  <span className="text-sm font-normal text-gray-500">({trainNum})</span>
                </h2>
                <span className="inline-block mt-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                  {CLASS_LABELS[classCode] ?? classCode} &nbsp;|&nbsp; General
                </span>
              </div>
              <Link
                href={searchHref}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-[#1a3c6e] hover:text-[#1a3c6e] dark:hover:border-blue-400 dark:hover:text-blue-300 transition-colors shrink-0 mt-1"
              >
                ← Change Train
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{depTime}</div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{fromStn}</div>
                <div className="text-xs text-gray-400">{journeyDate}</div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{duration}</span>
                <div className="w-full flex items-center gap-1">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{arrTime}</div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{toStn}</div>
                <div className="text-xs text-gray-400">Next Day</div>
              </div>
            </div>

            {/* Collapsible boarding station */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Boarding Station: </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{fromStn}</span>
                    &nbsp;| Dep: {depTime} | Day 1 | Boarding Date: {journeyDate}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 ml-2 transition-transform group-open:rotate-180">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-xs text-gray-500 dark:text-gray-400">
                  Please check NTES website or NTES app for actual time before boarding.
                </div>
              </details>
            </div>
          </section>

          {/* Passenger Details */}
          <section className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Passenger Details</h3>

            {/* Info note */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <p>• Please submit the full name of each passenger — initials are not accepted.</p>
              <p>• A valid ID card (Aadhaar, PAN, Passport, etc.) must be carried during journey.</p>
            </div>

            <div className="space-y-3">
              {passengers.map((p, i) => (
                <PassengerCard
                  key={p.id}
                  passenger={p}
                  index={i}
                  onUpdate={updatePassenger}
                  onBlurField={blurPassengerField}
                  onRemove={removePassenger}
                  showRemove={passengers.length > 1}
                />
              ))}
            </div>

            {passengers.length < 6 && (
              <button
                onClick={addPassenger}
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-1"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Add Passenger / Add Infant With Berth
              </button>
            )}
          </section>

          {/* Contact Details */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Contact Details</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Ticket details will be sent to your registered email and mobile number.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-400 font-medium">
                  +91
                </div>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </section>

          {/* GST Details */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
              GST Details{' '}
              <span className="text-xs font-normal text-gray-400">(Optional)</span>
            </h3>
            <input
              type="text"
              placeholder="GST Identification Number (GSTIN)"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </section>

          {/* Other Preferences */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Other Preferences</h3>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={autoUpgrade}
                onChange={(e) => setAutoUpgrade(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-blue-700 cursor-pointer"
              />
              <div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Consider for Auto Upgradation
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  In a higher class you may or may not receive a lower berth.
                </p>
              </div>
            </label>
          </section>

          {/* Payment Mode — grouped categories with icons (Miller's Law fix) */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Payment Mode</h3>
            <PaymentModeSection selected={paymentMethod} onSelect={setPaymentMethod} />
          </section>

          {/* Proceed CTA */}
          <button
            type="button"
            onClick={handleProceed}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold
              py-4 px-6 rounded-xl text-lg tracking-wide shadow-md
              hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg transition-all duration-150"
          >
            Review &amp; Pay &nbsp;— &nbsp;₹ {grandTotal.toLocaleString('en-IN')}
          </button>
        </div>

        {/* ════════════════════════════════════════════
            RIGHT — Sticky order summary sidebar
            Nielsen's #6: Recognition rather than Recall fix
            ════════════════════════════════════════════ */}
        <div className="lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-4 space-y-4">

            {/* Order Summary card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-[#1a3c6e] dark:bg-gray-900 px-5 py-3">
                <h3 className="text-white font-bold text-sm">Booking Summary</h3>
              </div>

              <div className="p-5 space-y-4 text-sm">
                {/* Train info */}
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{trainName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Train #{trainNum}</p>
                </div>

                {/* Route */}
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{fromStn}</p>
                    <p className="text-xs text-gray-400">{depTime}</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{toStn}</p>
                    <p className="text-xs text-gray-400">{arrTime}</p>
                  </div>
                </div>

                {/* Trip metadata */}
                <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3 text-xs">
                  <div>
                    <p className="text-gray-400 mb-0.5">Date</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{journeyDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Class</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{classCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Quota</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">General</p>
                  </div>
                </div>

                {/* Passengers */}
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Passengers</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{passengers.length}</span>
                </div>

                {/* Fare breakdown */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-2">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>
                      Ticket fare &nbsp;({passengers.length} × ₹{basePrice.toLocaleString('en-IN')})
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹ {ticketFare.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Convenience fee</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹ {convFee}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>GST on conv. fee (18%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹ {gst}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center font-bold text-base bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-3">
                  <span className="text-gray-900 dark:text-white">Total Fare</span>
                  <span className="text-[#1a3c6e] dark:text-blue-300 tabular-nums">
                    ₹ {grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* IRCTC Co-branded Card — de-emphasized, moved below summary */}
            {/* Task-Focused Design fix: no longer looks like a required step */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                IRCTC Card Benefits
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Earn up to 10% reward points and get a 1% PG waiver with an IRCTC co-branded card.
              </p>
              <div className="flex gap-2">
                {['Earn Points', 'Pay with Points', 'Skip'].map((opt) => (
                  <button
                    key={opt}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600
                      text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600
                      dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* Progress Stepper — Nielsen's #1: Visibility of System Status fix */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 px-6 shadow-sm">
        <ProgressStepper currentStep={3} />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
            Loading booking details…
          </div>
        }
      >
        <BookingContent />
      </Suspense>
    </div>
  )
}
