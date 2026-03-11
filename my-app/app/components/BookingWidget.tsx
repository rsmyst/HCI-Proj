'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'book' | 'pnr' | 'schedule' | 'between'

const tabs: { id: Tab; label: string }[] = [
  { id: 'book', label: 'Book Tickets' },
  { id: 'pnr', label: 'PNR Status' },
  { id: 'schedule', label: 'Train Schedule' },
  { id: 'between', label: 'Trains Between Stations' },
]

export default function BookingWidget() {
  const [activeTab, setActiveTab] = useState<Tab>('book')

  return (
    <div className="w-full">
      {/* Folder-style tabs — Law of Common Region */}
      <div className="flex gap-1 items-end">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'px-4 py-2.5 text-sm font-medium rounded-t-lg border-t border-x transition-all duration-150',
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-800 text-[#1a3c6e] dark:text-blue-300 border-gray-200 dark:border-gray-600 border-t-2 border-t-orange-500 relative z-10 -mb-px'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 hover:-translate-y-0.5',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Widget body */}
      <div className="bg-white dark:bg-gray-800 rounded-b-xl rounded-tr-xl border border-gray-200 dark:border-gray-600 shadow-2xl p-6 transition-colors duration-300">
        {activeTab === 'book' && <BookTicketsForm />}
        {activeTab === 'pnr' && <PNRForm />}
        {activeTab === 'schedule' && <ScheduleForm />}
        {activeTab === 'between' && <BetweenForm />}
      </div>
    </div>
  )
}

function InputLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{children}</label>
  )
}

const inputClass =
  'w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition'

const selectClass =
  'w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition'

function SearchButton({ label = 'Search Trains', href = '/search' }: { label?: string; href?: string }) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push(href)}
      className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 px-6 rounded-md text-base tracking-wide shadow-md
        hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg transition-all duration-150"
    >
      {label}
    </button>
  )
}

function BookTicketsForm() {
  const router = useRouter()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [trainClass, setTrainClass] = useState('All Classes')
  const [quota, setQuota] = useState('General')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (from.trim())  params.set('from', from.trim().toUpperCase())
    if (to.trim())    params.set('to', to.trim().toUpperCase())
    if (date)         params.set('date', date)
    if (trainClass)   params.set('class', trainClass)
    if (quota)        params.set('quota', quota)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <InputLabel>From</InputLabel>
          <input
            type="text"
            placeholder="City or station name"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <InputLabel>To</InputLabel>
          <input
            type="text"
            placeholder="City or station name"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <InputLabel>Date of Journey</InputLabel>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <InputLabel>Class</InputLabel>
          <select value={trainClass} onChange={(e) => setTrainClass(e.target.value)} className={selectClass}>
            <option>All Classes</option>
            <option>Sleeper (SL)</option>
            <option>Third AC (3A)</option>
            <option>Second AC (2A)</option>
            <option>First AC (1A)</option>
            <option>Chair Car (CC)</option>
            <option>Executive Chair (EC)</option>
          </select>
        </div>
        <div>
          <InputLabel>Quota</InputLabel>
          <select value={quota} onChange={(e) => setQuota(e.target.value)} className={selectClass}>
            <option>General</option>
            <option>Ladies</option>
            <option>Tatkal</option>
            <option>Premium Tatkal</option>
          </select>
        </div>
      </div>

      {/* High-contrast labels — Error Prevention */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded accent-blue-700" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Person with Disability Concession</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded accent-blue-700" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Flexible with Date</span>
        </label>
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 px-6 rounded-md text-base tracking-wide shadow-md
          hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg transition-all duration-150"
      >
        Search Trains
      </button>
    </div>
  )
}

function PNRForm() {
  return (
    <div className="space-y-4">
      <div>
        <InputLabel>PNR Number</InputLabel>
        <input
          type="text"
          placeholder="Enter your 10-digit PNR number"
          maxLength={10}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your PNR number can be found on your booking confirmation.</p>
      </div>
      <SearchButton label="Get PNR Status" />
    </div>
  )
}

function ScheduleForm() {
  return (
    <div className="space-y-4">
      <div>
        <InputLabel>Train Number or Name</InputLabel>
        <input type="text" placeholder="e.g. 12301 or Rajdhani Express" className={inputClass} />
      </div>
      <SearchButton label="Get Schedule" />
    </div>
  )
}

function BetweenForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <InputLabel>From</InputLabel>
          <input type="text" placeholder="Source station" className={inputClass} />
        </div>
        <div>
          <InputLabel>To</InputLabel>
          <input type="text" placeholder="Destination station" className={inputClass} />
        </div>
      </div>
      <div>
        <InputLabel>Date</InputLabel>
        <input type="date" className={inputClass} />
      </div>
      <SearchButton />
    </div>
  )
}
