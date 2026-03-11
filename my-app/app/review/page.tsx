'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import ProgressStepper from '../components/ProgressStepper'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PAYMENT_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  cards: {
    label: 'Credit / Debit Card',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  netbanking: {
    label: 'Net Banking',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" />
        <line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" />
        <line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" />
      </svg>
    ),
  },
  upi: {
    label: 'UPI / BHIM UPI',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  wallets: {
    label: 'Wallets & Rewards',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 12V7H4a2 2 0 000 4h16v1" /><path d="M20 12v5H4a2 2 0 01-2-2v-3" />
        <circle cx="17" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
}

const GENDER_LABELS: Record<string, string> = { M: 'Male', F: 'Female', T: 'Transgender' }

const CLASS_LABELS: Record<string, string> = {
  SL: 'Sleeper (SL)', '3A': 'AC 3 Tier (3A)', '2A': 'AC 2 Tier (2A)',
  '1A': 'AC First Class (1A)', '3E': 'AC 3 Economy (3E)',
}

// ─── Row helper ───────────────────────────────────────────────────────────────

function Row({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0 ${highlight ? 'font-bold text-base' : 'text-sm'}`}>
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={highlight ? 'text-[#1a3c6e] dark:text-blue-300 tabular-nums' : 'font-medium text-gray-900 dark:text-white'}>
        {value}
      </span>
    </div>
  )
}

// ─── Confirmation modal ───────────────────────────────────────────────────────

function ConfirmModal({ total, onClose }: { total: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in-up">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-600 dark:text-green-400">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Your payment of <strong className="text-gray-900 dark:text-white">₹ {total}</strong> was successful. A confirmation has been sent to your registered email and mobile number.
        </p>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 mb-6 text-sm">
          <p className="text-gray-400 text-xs mb-1">PNR Number</p>
          <p className="text-2xl font-bold text-[#1a3c6e] dark:text-blue-300 tracking-widest tabular-nums">
            {Math.floor(1000000000 + Math.random() * 9000000000)}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#1a3c6e] hover:bg-[#1e4d8c] text-white font-bold py-3 rounded-xl text-sm transition-all duration-150"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

// ─── Review content ───────────────────────────────────────────────────────────

function ReviewContent() {
  const params    = useSearchParams()
  const router    = useRouter()
  const [paying, setPaying]   = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  // Read all params passed from booking page
  const trainName   = params.get('name')      ?? 'PANCHAGANGA EXP'
  const trainNum    = params.get('train')     ?? '16596'
  const classCode   = params.get('class')     ?? 'SL'
  const fromStn     = params.get('from')      ?? 'SURATHKAL'
  const toStn       = params.get('to')        ?? 'KSR BENGALURU'
  const journeyDate = params.get('date')      ?? 'Fri, 13 Mar'
  const depTime     = params.get('dep')       ?? '21:56'
  const arrTime     = params.get('arr')       ?? '07:15'
  const duration    = params.get('dur')       ?? '9h 19m'
  const paymentId   = params.get('payment')   ?? 'upi'
  const total       = params.get('total')     ?? '320'
  const convFee     = params.get('convFee')   ?? '10'
  const gst         = params.get('gst')       ?? '2'
  const contact     = params.get('contact')   ?? ''
  const basePrice   = params.get('price')     ?? '310'

  const passengersRaw = params.get('passengers')
  const passengers: { name: string; age: string; gender: string; berth: string }[] =
    passengersRaw ? JSON.parse(passengersRaw) : []

  const ticketFare = parseInt(basePrice, 10) * (passengers.length || 1)
  const payment = PAYMENT_LABELS[paymentId] ?? PAYMENT_LABELS.upi

  const handleConfirmPay = () => {
    setPaying(true)
    // Simulate payment gateway delay
    setTimeout(() => {
      setPaying(false)
      setConfirmed(true)
    }, 1800)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
      {/* Back link */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-5"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to Passenger Details
      </button>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── LEFT: Review sections ── */}
        <div className="flex-1 space-y-5 min-w-0">

          {/* Journey Details */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider text-[#1a3c6e] dark:text-blue-300">
              Journey Details
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{depTime}</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{fromStn}</p>
                <p className="text-xs text-gray-400">{journeyDate}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">{duration}</span>
                <div className="w-full flex items-center gap-1">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{arrTime}</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{toStn}</p>
                <p className="text-xs text-gray-400">Next Day</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-gray-700/50 rounded-xl p-3 text-xs">
              <div>
                <p className="text-gray-400 mb-0.5">Train</p>
                <p className="font-semibold text-gray-900 dark:text-white">{trainName} ({trainNum})</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Class</p>
                <p className="font-semibold text-gray-900 dark:text-white">{CLASS_LABELS[classCode] ?? classCode}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Quota</p>
                <p className="font-semibold text-gray-900 dark:text-white">General</p>
              </div>
            </div>
          </section>

          {/* Passenger Summary */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider text-[#1a3c6e] dark:text-blue-300">
              Passengers ({passengers.length})
            </h3>
            <div className="space-y-2">
              {passengers.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300 shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</p>
                      <p className="text-xs text-gray-400">
                        {p.age} yrs &nbsp;·&nbsp; {GENDER_LABELS[p.gender] ?? p.gender}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-medium">
                    {p.berth}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          {contact && (
            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider text-[#1a3c6e] dark:text-blue-300">
                Contact
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">+91 {contact}</p>
            </section>
          )}

          {/* Payment method */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider text-[#1a3c6e] dark:text-blue-300">
              Payment Method
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1a3c6e] dark:bg-blue-700 text-white flex items-center justify-center shrink-0">
                {payment.icon}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{payment.label}</p>
            </div>
          </section>

          {/* Important info */}
          <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
            <p className="font-semibold mb-1">Before you pay:</p>
            <p>• Please verify all passenger names and ages match the ID card that will be presented during the journey.</p>
            <p>• Check the NTES website or app for actual departure time before boarding.</p>
            <p>• Tickets are non-transferable. Cancellation charges apply as per IRCTC policy.</p>
          </section>

          {/* Confirm & Pay CTA */}
          <button
            onClick={handleConfirmPay}
            disabled={paying}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-orange-400
              text-white font-bold py-4 px-6 rounded-xl text-lg tracking-wide shadow-md
              hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg transition-all duration-150
              flex items-center justify-center gap-3"
          >
            {paying ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                </svg>
                Processing Payment…
              </>
            ) : (
              <>
                Confirm &amp; Pay — ₹ {parseInt(total).toLocaleString('en-IN')}
              </>
            )}
          </button>
        </div>

        {/* ── RIGHT: Sticky fare summary ── */}
        <div className="lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="bg-[#1a3c6e] dark:bg-gray-900 px-5 py-3">
              <h3 className="text-white font-bold text-sm">Fare Summary</h3>
            </div>
            <div className="p-5">
              <Row label={`Ticket fare (${passengers.length} × ₹${parseInt(basePrice).toLocaleString('en-IN')})`} value={`₹ ${ticketFare.toLocaleString('en-IN')}`} />
              <Row label="Convenience fee" value={`₹ ${convFee}`} />
              <Row label="GST (18%)" value={`₹ ${gst}`} />
              <div className="mt-3 pt-3 border-t-2 border-gray-200 dark:border-gray-600 flex justify-between items-center font-bold text-base">
                <span className="text-gray-900 dark:text-white">Total Payable</span>
                <span className="text-[#1a3c6e] dark:text-blue-300 tabular-nums text-lg">
                  ₹ {parseInt(total).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmed && (
        <ConfirmModal
          total={parseInt(total).toLocaleString('en-IN')}
          onClose={() => router.push('/')}
        />
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* Progress Stepper — step 4 active */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 px-6 shadow-sm">
        <ProgressStepper currentStep={4} />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
            Loading review…
          </div>
        }
      >
        <ReviewContent />
      </Suspense>
    </div>
  )
}
