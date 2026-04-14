'use client'

import { useState } from 'react'
import type { DashboardData } from '../data/dashboard'

const iconMap = {
  train: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="4" y="3" width="16" height="13" rx="2" />
      <path d="M4 14h16" />
      <path d="M8 21l2-4" />
      <path d="M16 21l-2-4" />
      <circle cx="8" cy="10" r="1" />
      <circle cx="16" cy="10" r="1" />
    </svg>
  ),
  flight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
    </svg>
  ),
  hotel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M3 10h18" />
      <path d="M4 10V6a2 2 0 012-2h5a2 2 0 012 2v4" />
      <path d="M4 20v-6" />
      <path d="M20 20v-6" />
      <path d="M3 20h18" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  ),
  bus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M3 11h18" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
  cab: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M5 16H3a2 2 0 01-2-2V6a2 2 0 012-2h11l5 5v7a2 2 0 01-2 2h-2" />
      <circle cx="7" cy="16" r="2" />
      <circle cx="17" cy="16" r="2" />
      <path d="M3 10h18" />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  temple: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M3 22V8l9-6 9 6v14" />
      <path d="M12 22V16" />
      <path d="M9 13h6" />
      <path d="M9 9h6" />
    </svg>
  ),
}

type Service = DashboardData['services'][number]

export default function ServicesSection({ services }: { services: Service[] }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? services : services.slice(0, 4)

  return (
    <section className="bg-white dark:bg-gray-900 py-14 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 font-display">Our services</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Progressive menus reduce decision time.</p>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="text-sm font-medium text-[#1a3c6e] dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 rounded-full px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            aria-expanded={expanded}
          >
            {expanded ? 'Show fewer services' : `Show all ${services.length} services`}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {visible.map((service, index) => (
            <button
              key={service.id}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-slate-50/60 dark:bg-gray-950/30 hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-[#1a3c6e] dark:text-blue-300
                group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-200">
                {iconMap[service.icon]}
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{service.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug hidden sm:block">{service.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
