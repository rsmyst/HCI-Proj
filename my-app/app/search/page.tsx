'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import ProgressStepper from '../components/ProgressStepper'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

type AvailStatus = 'AVAILABLE' | 'RAC' | 'WL'

interface DateSlot {
  label: string      // "Fri, 13 Mar"
  isoDate?: string
  status: AvailStatus
  count: number
}

interface TrainClass {
  code: string
  label: string
  basePrice: number
  dates: DateSlot[]
}

interface Train {
  name: string
  number: string
  runsOn: boolean[]  // 7 booleans: Mon–Sun
  dep: { time: string; station: string; date: string }
  arr: { time: string; station: string; date: string }
  duration: string
  classes: TrainClass[]
}

interface ClassTemplate {
  code: string
  label: string
  basePrice: number
  pattern: { status: AvailStatus; count: number }[]
}

interface TrainTemplate {
  name: string
  number: string
  runsOn: boolean[]
  dep: { time: string; station: string }
  arr: { time: string; station: string }
  duration: string
  classes: ClassTemplate[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const POPULAR_TRAIN_TEMPLATES: TrainTemplate[] = [
  {
    name: 'CHENNAI SHATABDI',
    number: '12028',
    runsOn: [true, true, true, true, true, true, false],
    dep: { time: '06:00', station: 'BENGALURU (SBC)' },
    arr: { time: '12:30', station: 'CHENNAI (MAS)' },
    duration: '6h 30m',
    classes: [
      {
        code: 'CC',
        label: 'Chair Car (CC)',
        basePrice: 645,
        pattern: [
          { status: 'AVAILABLE', count: 42 },
          { status: 'AVAILABLE', count: 28 },
          { status: 'RAC', count: 18 },
          { status: 'AVAILABLE', count: 35 },
          { status: 'RAC', count: 10 },
          { status: 'WL', count: 6 },
        ],
      },
      {
        code: 'EC',
        label: 'Executive Chair (EC)',
        basePrice: 1250,
        pattern: [
          { status: 'AVAILABLE', count: 12 },
          { status: 'AVAILABLE', count: 9 },
          { status: 'AVAILABLE', count: 6 },
          { status: 'AVAILABLE', count: 8 },
          { status: 'RAC', count: 4 },
          { status: 'RAC', count: 2 },
        ],
      },
    ],
  },
  {
    name: 'DECCAN EXPRESS',
    number: '12123',
    runsOn: [true, true, true, true, true, true, true],
    dep: { time: '07:00', station: 'MUMBAI (CSMT)' },
    arr: { time: '10:25', station: 'PUNE (PUNE)' },
    duration: '3h 25m',
    classes: [
      {
        code: 'CC',
        label: 'Chair Car (CC)',
        basePrice: 420,
        pattern: [
          { status: 'AVAILABLE', count: 60 },
          { status: 'AVAILABLE', count: 44 },
          { status: 'RAC', count: 20 },
          { status: 'AVAILABLE', count: 32 },
          { status: 'WL', count: 12 },
          { status: 'RAC', count: 18 },
        ],
      },
      {
        code: '2S',
        label: 'Second Sitting (2S)',
        basePrice: 155,
        pattern: [
          { status: 'AVAILABLE', count: 120 },
          { status: 'AVAILABLE', count: 95 },
          { status: 'AVAILABLE', count: 80 },
          { status: 'RAC', count: 32 },
          { status: 'RAC', count: 20 },
          { status: 'WL', count: 15 },
        ],
      },
    ],
  },
  {
    name: 'AJMER SHATABDI',
    number: '12016',
    runsOn: [true, true, true, true, true, true, true],
    dep: { time: '06:05', station: 'DELHI (NDLS)' },
    arr: { time: '10:40', station: 'JAIPUR (JP)' },
    duration: '4h 35m',
    classes: [
      {
        code: 'CC',
        label: 'Chair Car (CC)',
        basePrice: 535,
        pattern: [
          { status: 'AVAILABLE', count: 36 },
          { status: 'AVAILABLE', count: 24 },
          { status: 'RAC', count: 16 },
          { status: 'AVAILABLE', count: 30 },
          { status: 'RAC', count: 12 },
          { status: 'WL', count: 8 },
        ],
      },
      {
        code: 'EC',
        label: 'Executive Chair (EC)',
        basePrice: 1095,
        pattern: [
          { status: 'AVAILABLE', count: 10 },
          { status: 'AVAILABLE', count: 7 },
          { status: 'AVAILABLE', count: 5 },
          { status: 'AVAILABLE', count: 6 },
          { status: 'RAC', count: 3 },
          { status: 'RAC', count: 2 },
        ],
      },
    ],
  },
]

const TRAINS: Train[] = [
  {
    name: 'MRDW SMVB EXP',
    number: '16586',
    runsOn: [true, true, true, true, true, true, true],
    dep: { time: '16:52', station: 'SURATHKAL', date: 'Fri, 13 Mar' },
    arr: { time: '06:25', station: 'KSR BENGALURU', date: 'Sat, 14 Mar' },
    duration: '13h 33m',
    classes: [
      {
        code: 'SL', label: 'Sleeper (SL)', basePrice: 335,
        dates: [
          { label: 'Fri, 13 Mar', status: 'RAC', count: 36 },
          { label: 'Sat, 14 Mar', status: 'RAC', count: 78 },
          { label: 'Sun, 15 Mar', status: 'WL', count: 67 },
          { label: 'Mon, 16 Mar', status: 'RAC', count: 72 },
          { label: 'Tue, 17 Mar', status: 'AVAILABLE', count: 79 },
          { label: 'Wed, 18 Mar', status: 'RAC', count: 12 },
        ],
      },
      {
        code: '3A', label: 'AC 3 Tier (3A)', basePrice: 855,
        dates: [
          { label: 'Fri, 13 Mar', status: 'AVAILABLE', count: 12 },
          { label: 'Sat, 14 Mar', status: 'AVAILABLE', count: 8 },
          { label: 'Sun, 15 Mar', status: 'AVAILABLE', count: 5 },
          { label: 'Mon, 16 Mar', status: 'AVAILABLE', count: 15 },
          { label: 'Tue, 17 Mar', status: 'AVAILABLE', count: 22 },
          { label: 'Wed, 18 Mar', status: 'WL', count: 3 },
        ],
      },
      {
        code: '2A', label: 'AC 2 Tier (2A)', basePrice: 1235,
        dates: [
          { label: 'Fri, 13 Mar', status: 'AVAILABLE', count: 4 },
          { label: 'Sat, 14 Mar', status: 'AVAILABLE', count: 6 },
          { label: 'Sun, 15 Mar', status: 'AVAILABLE', count: 2 },
          { label: 'Mon, 16 Mar', status: 'AVAILABLE', count: 8 },
          { label: 'Tue, 17 Mar', status: 'AVAILABLE', count: 10 },
          { label: 'Wed, 18 Mar', status: 'AVAILABLE', count: 3 },
        ],
      },
      {
        code: '1A', label: 'AC First Class (1A)', basePrice: 2075,
        dates: [
          { label: 'Fri, 13 Mar', status: 'AVAILABLE', count: 2 },
          { label: 'Sat, 14 Mar', status: 'AVAILABLE', count: 3 },
          { label: 'Sun, 15 Mar', status: 'AVAILABLE', count: 1 },
          { label: 'Mon, 16 Mar', status: 'AVAILABLE', count: 4 },
          { label: 'Tue, 17 Mar', status: 'AVAILABLE', count: 5 },
          { label: 'Wed, 18 Mar', status: 'AVAILABLE', count: 2 },
        ],
      },
    ],
  },
  {
    name: 'PANCHAGANGA EXP',
    number: '16596',
    runsOn: [true, true, true, true, true, true, true],
    dep: { time: '21:56', station: 'SURATHKAL', date: 'Fri, 13 Mar' },
    arr: { time: '07:15', station: 'KSR BENGALURU', date: 'Sat, 14 Mar' },
    duration: '9h 19m',
    classes: [
      {
        code: 'SL', label: 'Sleeper (SL)', basePrice: 310,
        dates: [
          { label: 'Fri, 13 Mar', status: 'WL', count: 28 },
          { label: 'Sat, 14 Mar', status: 'WL', count: 31 },
          { label: 'Sun, 15 Mar', status: 'WL', count: 77 },
          { label: 'Mon, 16 Mar', status: 'WL', count: 24 },
          { label: 'Tue, 17 Mar', status: 'WL', count: 30 },
          { label: 'Wed, 18 Mar', status: 'WL', count: 15 },
        ],
      },
      {
        code: '3E', label: 'AC 3 Economy (3E)', basePrice: 695,
        dates: [
          { label: 'Fri, 13 Mar', status: 'AVAILABLE', count: 18 },
          { label: 'Sat, 14 Mar', status: 'AVAILABLE', count: 22 },
          { label: 'Sun, 15 Mar', status: 'AVAILABLE', count: 14 },
          { label: 'Mon, 16 Mar', status: 'AVAILABLE', count: 30 },
          { label: 'Tue, 17 Mar', status: 'AVAILABLE', count: 25 },
          { label: 'Wed, 18 Mar', status: 'AVAILABLE', count: 19 },
        ],
      },
      {
        code: '3A', label: 'AC 3 Tier (3A)', basePrice: 815,
        dates: [
          { label: 'Fri, 13 Mar', status: 'AVAILABLE', count: 8 },
          { label: 'Sat, 14 Mar', status: 'AVAILABLE', count: 11 },
          { label: 'Sun, 15 Mar', status: 'AVAILABLE', count: 5 },
          { label: 'Mon, 16 Mar', status: 'AVAILABLE', count: 13 },
          { label: 'Tue, 17 Mar', status: 'AVAILABLE', count: 9 },
          { label: 'Wed, 18 Mar', status: 'AVAILABLE', count: 7 },
        ],
      },
      {
        code: '2A', label: 'AC 2 Tier (2A)', basePrice: 1155,
        dates: [
          { label: 'Fri, 13 Mar', status: 'AVAILABLE', count: 3 },
          { label: 'Sat, 14 Mar', status: 'AVAILABLE', count: 5 },
          { label: 'Sun, 15 Mar', status: 'AVAILABLE', count: 2 },
          { label: 'Mon, 16 Mar', status: 'AVAILABLE', count: 7 },
          { label: 'Tue, 17 Mar', status: 'AVAILABLE', count: 4 },
          { label: 'Wed, 18 Mar', status: 'AVAILABLE', count: 2 },
        ],
      },
      {
        code: '1A', label: 'AC First Class (1A)', basePrice: 1955,
        dates: [
          { label: 'Fri, 13 Mar', status: 'AVAILABLE', count: 1 },
          { label: 'Sat, 14 Mar', status: 'AVAILABLE', count: 2 },
          { label: 'Sun, 15 Mar', status: 'AVAILABLE', count: 1 },
          { label: 'Mon, 16 Mar', status: 'AVAILABLE', count: 3 },
          { label: 'Tue, 17 Mar', status: 'AVAILABLE', count: 2 },
          { label: 'Wed, 18 Mar', status: 'AVAILABLE', count: 1 },
        ],
      },
    ],
  },
]

// ─── Availability Badge ────────────────────────────────────────────────────────

function AvailBadge({ status, count }: { status: AvailStatus; count: number }) {
  if (status === 'AVAILABLE') {
    return (
      <span className="text-sm font-bold text-green-700 dark:text-green-400">
        AVBL {count}
      </span>
    )
  }
  if (status === 'RAC') {
    return (
      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
        RAC {count}
      </span>
    )
  }
  return (
    <span className="text-sm font-bold text-red-600 dark:text-red-400">
      WL {count}
    </span>
  )
}

// ─── Train Card ───────────────────────────────────────────────────────────────

function TrainCard({ train }: { train: Train }) {
  const [expandedClass, setExpandedClass] = useState<string | null>(null)
  const router = useRouter()

  const activeClass = train.classes.find((c) => c.code === expandedClass)

  const handleBook = (cls: TrainClass, date: DateSlot) => {
    const params = new URLSearchParams({
      train: train.number,
      name: train.name,
      class: cls.code,
      price: String(cls.basePrice),
      from: train.dep.station,
      to: train.arr.station,
      date: date.label,
      dateISO: date.isoDate ?? inferDateISOFromLabel(date.label),
      dep: train.dep.time,
      arr: train.arr.time,
      dur: train.duration,
    })
    router.push(`/booking?${params.toString()}`)
  }

  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* ── Header ── */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{train.name}</h3>
              <span className="text-sm text-gray-400 dark:text-gray-500">({train.number})</span>
            </div>
            {/* Days row */}
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-xs text-gray-400 dark:text-gray-500 mr-0.5">Runs on:</span>
              {DAY_LABELS.map((d, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                    train.runsOn[i]
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-300 dark:bg-gray-700 dark:text-gray-600'
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
          <a
            href="#"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0 mt-1 font-medium"
          >
            Train Schedule
          </a>
        </div>

        {/* Route row */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{train.dep.time}</div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{train.dep.station}</div>
            <div className="text-xs text-gray-400">{train.dep.date}</div>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{train.duration}</span>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-400 shrink-0"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{train.arr.time}</div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{train.arr.station}</div>
            <div className="text-xs text-gray-400">{train.arr.date}</div>
          </div>
        </div>
      </div>

      {/* ── Class tabs (Progressive Disclosure – Hick's Law fix) ── */}
      <div className="px-5 pt-3 pb-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
          Select a class to check availability &amp; pricing:
        </p>
        <div className="flex flex-wrap gap-2">
          {train.classes.map((cls) => {
            const isActive = expandedClass === cls.code
            return (
              <button
                key={cls.code}
                onClick={() => setExpandedClass(isActive ? null : cls.code)}
                aria-expanded={isActive}
                aria-controls={`avail-${train.number}-${cls.code}`}
                className={[
                  'flex flex-col items-start px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[#1a3c6e] text-white border-[#1a3c6e] dark:bg-blue-700 dark:border-blue-700 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#1a3c6e] hover:text-[#1a3c6e] dark:hover:border-blue-400 dark:hover:text-blue-300',
                ].join(' ')}
              >
                <span>{cls.label}</span>
                <span
                  className={`text-xs font-bold mt-0.5 ${
                    isActive ? 'text-blue-200' : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  ₹ {cls.basePrice.toLocaleString('en-IN')}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Expanded availability (revealed on class click) ── */}
      {activeClass && (
        <div
          id={`avail-${train.number}-${activeClass.code}`}
          className="px-5 pb-5 pt-4 bg-slate-50 dark:bg-gray-700/40 border-t border-blue-100 dark:border-gray-600 animate-slide-down"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Showing seats for&nbsp;
            <strong className="text-gray-700 dark:text-gray-200">{activeClass.label}</strong>
            &nbsp;— click a date to book
          </p>

          {/* Date availability grid */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {activeClass.dates.map((d) => (
              <button
                key={d.label}
                onClick={() => handleBook(activeClass, d)}
                className="flex-shrink-0 min-w-[110px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-left
                  hover:border-[#1a3c6e] dark:hover:border-blue-400 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 group-hover:text-[#1a3c6e] dark:group-hover:text-blue-300 transition-colors">
                  {d.label}
                </div>
                <AvailBadge status={d.status} count={d.count} />
              </button>
            ))}
          </div>

          {/* NTES note + Book Now CTA */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Please check{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                NTES website
              </a>{' '}
              or{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                NTES app
              </a>{' '}
              for actual departure time before boarding.
            </p>

            {/* Large, prominent Book Now button — Fitts's Law fix */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                ₹ {activeClass.basePrice.toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => handleBook(activeClass, activeClass.dates[0])}
                className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold
                  py-3 px-8 rounded-xl text-base tracking-wide shadow-md
                  hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg transition-all duration-150
                  min-w-[140px]"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

// ─── Filters Sidebar ──────────────────────────────────────────────────────────

function FiltersSidebar() {
  const allClasses = [
    'AC First Class (1A)',
    'AC 2 Tier (2A)',
    'AC 3 Tier (3A)',
    'AC 3 Economy (3E)',
    'Sleeper (SL)',
  ]
  const depTimes = [
    { label: 'Early Morning', time: '00:00 – 06:00' },
    { label: 'Morning', time: '06:00 – 12:00' },
    { label: 'Mid Day', time: '12:00 – 18:00' },
    { label: 'Night', time: '18:00 – 24:00' },
  ]

  const [selectedClasses, setSelectedClasses] = useState(new Set(allClasses))
  const [selectedDep, setSelectedDep] = useState(new Set<string>())

  const toggleClass = (cls: string) =>
    setSelectedClasses((prev) => {
      const next = new Set(prev)
      next.has(cls) ? next.delete(cls) : next.add(cls)
      return next
    })

  const toggleDep = (label: string) =>
    setSelectedDep((prev) => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })

  return (
    <aside className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Refine Results</h3>
        <button
          onClick={() => {
            setSelectedClasses(new Set(allClasses))
            setSelectedDep(new Set())
          }}
          className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Journey Class */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Journey Class
          </h4>
          <button
            onClick={() => setSelectedClasses(new Set(allClasses))}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Select All
          </button>
        </div>
        <div className="space-y-2.5">
          {allClasses.map((cls) => (
            <label key={cls} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedClasses.has(cls)}
                onChange={() => toggleClass(cls)}
                className="w-4 h-4 rounded accent-blue-700 cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {cls}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Departure Time
          </h4>
          <button
            onClick={() => setSelectedDep(new Set(depTimes.map((t) => t.label)))}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Select All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {depTimes.map((t) => (
            <button
              key={t.label}
              onClick={() => toggleDep(t.label)}
              className={[
                'p-2.5 rounded-xl text-xs font-medium border text-center transition-all duration-150',
                selectedDep.has(t.label)
                  ? 'bg-[#1a3c6e] text-white border-[#1a3c6e] dark:bg-blue-700 dark:border-blue-700 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-[#1a3c6e] hover:text-[#1a3c6e] dark:hover:border-blue-400',
              ].join(' ')}
            >
              <div className="font-bold text-[10px] mb-0.5">{t.time}</div>
              <div>{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Train Type */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Train Type
        </h4>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-blue-700 cursor-pointer" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Other</span>
        </label>
      </div>
    </aside>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const SORT_OPTIONS = ['Departure', 'Duration', 'Arrival', 'Price']

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function isNextDay(depTime: string, arrTime: string): boolean {
  const [dh, dm] = depTime.split(':').map(Number)
  const [ah, am] = arrTime.split(':').map(Number)
  if (ah < dh) return true
  if (ah === dh && am < dm) return true
  return false
}

function buildDates(startISO: string, pattern: { status: AvailStatus; count: number }[]): DateSlot[] {
  const base = new Date(startISO)
  if (isNaN(base.getTime())) return []
  return Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    const entry = pattern[i % pattern.length]
    return {
      label: formatShortDate(d),
      isoDate: d.toISOString().slice(0, 10),
      status: entry.status,
      count: entry.count,
    }
  })
}

function inferDateISOFromLabel(label: string): string {
  const match = label.match(/^\w{3},\s*(\d{1,2})\s+(\w{3})$/)
  if (!match) return ''

  const [, day, month] = match
  const year = new Date().getFullYear()
  const parsedDate = new Date(`${day} ${month} ${year}`)

  if (Number.isNaN(parsedDate.getTime())) return ''
  return parsedDate.toISOString().slice(0, 10)
}

function buildTrain(template: TrainTemplate, startISO: string): Train {
  const depDate = new Date(startISO)
  const arrDate = new Date(startISO)
  if (isNextDay(template.dep.time, template.arr.time)) {
    arrDate.setDate(arrDate.getDate() + 1)
  }

  return {
    name: template.name,
    number: template.number,
    runsOn: template.runsOn,
    dep: {
      time: template.dep.time,
      station: template.dep.station,
      date: formatShortDate(depDate),
    },
    arr: {
      time: template.arr.time,
      station: template.arr.station,
      date: formatShortDate(arrDate),
    },
    duration: template.duration,
    classes: template.classes.map((cls) => ({
      code: cls.code,
      label: cls.label,
      basePrice: cls.basePrice,
      dates: buildDates(startISO, cls.pattern),
    })),
  }
}

function matchStation(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function SearchResults() {
  const params = useSearchParams()
  const router = useRouter()
  const [activeSort, setActiveSort] = useState('Departure')

  const fromStn    = params.get('from')  || 'ANY ORIGIN'
  const toStn      = params.get('to')    || 'ANY DESTINATION'
  const dateRaw    = params.get('date')  || ''
  const trainClass = params.get('class') || 'All Classes'
  const quota      = params.get('quota') || 'General'
  const dateLabel  = formatDate(dateRaw)

  const baseDate = dateRaw || new Date().toISOString().slice(0, 10)

  const popularMatches = POPULAR_TRAIN_TEMPLATES.filter((t) =>
    matchStation(t.dep.station, fromStn) && matchStation(t.arr.station, toStn)
  )

  const baseTrains = popularMatches.length > 0
    ? popularMatches.map((t) => buildTrain(t, baseDate))
    : TRAINS

  // Filter trains that match the searched route (case-insensitive partial match)
  const filteredTrains = baseTrains.filter((t) => {
    const fromMatch = !params.get('from') ||
      t.dep.station.toLowerCase().includes(fromStn.toLowerCase())
    const toMatch = !params.get('to') ||
      t.arr.station.toLowerCase().includes(toStn.toLowerCase())
    return fromMatch && toMatch
  })

  const handleModify = () => router.push('/')
  const bookingHref = `/booking?${new URLSearchParams({
    from: fromStn,
    to: toStn,
    date: dateRaw,
  }).toString()}`

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* Progress stepper — Nielsen's #1: Visibility of System Status */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 px-6 shadow-sm">
        <ProgressStepper currentStep={2} />
      </div>

      {/* Search summary bar */}
      <div className="bg-[#1a3c6e] dark:bg-gray-900 text-white px-6 py-3 shadow">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2 font-bold">
            <span>{fromStn}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-300 shrink-0">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span>{toStn}</span>
          </div>
          {dateLabel && (<><span className="text-blue-400 hidden sm:inline">|</span><span className="text-blue-100">{dateLabel}</span></>)}
          <span className="text-blue-400 hidden sm:inline">|</span>
          <span className="text-blue-100">{trainClass}</span>
          <span className="text-blue-400 hidden sm:inline">|</span>
          <span className="text-blue-100">{quota} Quota</span>
          <button
            onClick={handleModify}
            className="ml-auto bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-2 px-5 rounded-lg text-sm transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow"
          >
            Modify Search
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex gap-6">

          {/* Sidebar filters */}
          <div className="hidden lg:block w-60 shrink-0">
            <FiltersSidebar />
          </div>

          {/* Results column */}
          <div className="flex-1 space-y-4 min-w-0">

            {/* Results header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">
                  {filteredTrains.length} {filteredTrains.length === 1 ? 'Result' : 'Results'}
                </strong>
                {' '}for {fromStn} → {toStn}
                {dateLabel && <>&nbsp;|&nbsp;{dateLabel}</>}
                &nbsp;|&nbsp;{quota}
              </p>
              <div className="flex gap-2">
                <Link href="/dashboard" className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 text-sm text-white hover:bg-white/15 transition-colors">
                  Dashboard
                </Link>
                <Link href={bookingHref} className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 text-sm text-white hover:bg-white/15 transition-colors">
                  Booking
                </Link>
                <button className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:border-[#1a3c6e] dark:hover:border-blue-400 hover:text-[#1a3c6e] transition-colors">
                  ← Prev Day
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:border-[#1a3c6e] dark:hover:border-blue-400 hover:text-[#1a3c6e] transition-colors">
                  Next Day →
                </button>
              </div>
            </div>

            {/* Sort pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sort by:</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveSort(opt)}
                  className={[
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
                    activeSort === opt
                      ? 'bg-[#1a3c6e] text-white border-[#1a3c6e] dark:bg-blue-700 dark:border-blue-700 shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-[#1a3c6e] hover:text-[#1a3c6e] dark:hover:border-blue-400',
                  ].join(' ')}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Train cards or empty state */}
            {filteredTrains.length > 0 ? (
              filteredTrains.map((train) => (
                <TrainCard key={train.number} train={train} />
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No trains found for this route.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different source or destination, or check the spelling.</p>
                <button
                  onClick={handleModify}
                  className="mt-5 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all duration-150"
                >
                  Modify Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center text-gray-400 text-sm">
        Loading results…
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
