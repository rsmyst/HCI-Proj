'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { label: 'Book', href: '#booking' },
  { label: 'Manage', href: '#manage' },
  { label: 'Holidays', href: '#offers' },
  { label: 'Help', href: '#help' },
]

const moreLinks = [
  { label: 'Rail Drishti', href: '#' },
  { label: 'Catering', href: '#' },
  { label: 'Tourism', href: '#' },
  { label: 'Accessibility', href: '#help' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isDark, toggleDark } = useTheme()

  return (
    <nav className="relative z-50 bg-[#1a3c6e] dark:bg-gray-900 text-white shadow-lg transition-colors duration-300">
      {/* Utility bar */}
      <div className="bg-[#132f57] dark:bg-gray-950 px-6 py-1 flex justify-between items-center text-xs text-blue-200 dark:text-gray-400 transition-colors duration-300">
        <span>Ministry of Railways, Government of India</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors duration-150">Contact Us</a>
          <a href="#" className="hover:text-white transition-colors duration-150">Alerts</a>
          <a href="#" className="hover:text-white transition-colors duration-150">Hindi</a>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          <div className="bg-white rounded-lg p-1 transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/irctclogo.png"
              alt="IRCTC Logo"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight text-white">IRCTC</div>
            <div className="text-[10px] leading-tight text-blue-200 dark:text-gray-400">
              Indian Railway Catering &amp; Tourism
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative py-2 text-white/90 hover:text-white transition-colors duration-150
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0
                after:bg-orange-400 after:transition-all after:duration-300
                hover:after:w-full"
            >
              {link.label}
            </a>
          ))}

          <details className="relative group">
            <summary className="list-none cursor-pointer py-2 text-white/90 hover:text-white transition-colors duration-150 flex items-center gap-2">
              More
              <span aria-hidden className="text-xs">&#9662;</span>
            </summary>
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
              {moreLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </details>
        </div>

        {/* Right side: dark toggle + auth */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Dark / Light mode toggle */}
          <button
            onClick={toggleDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white
              hover:bg-white/10 active:bg-white/20 transition-all duration-150 mr-1"
          >
            {isDark ? (
              /* Sun icon */
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Moon icon */
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <Link href="/auth/register" className="border border-white/30 text-white text-sm px-4 py-2 rounded-md
            hover:bg-white/10 active:bg-white/20 transition-all duration-150">
            Register
          </Link>
          <Link href="/auth/login" className="bg-orange-500 text-white text-sm px-4 py-2 rounded-md font-medium shadow
            hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all duration-150">
            Login
          </Link>
        </div>

        {/* Mobile: dark toggle + hamburger */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            onClick={toggleDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded hover:bg-white/10 transition-colors"
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
          <button
            className="p-2 rounded hover:bg-white/10 active:bg-white/20 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5 transition-transform duration-200"
              style={{ transform: mobileOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#132f57] dark:bg-gray-950 border-t border-white/10 px-6 py-4 flex flex-col gap-3 text-sm animate-slide-down transition-colors duration-300">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-orange-300 py-1 transition-colors duration-150">
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-white/10">
            <div className="text-xs uppercase text-blue-200 dark:text-gray-400 tracking-wider mb-2">More</div>
            {moreLinks.map((link) => (
              <a key={link.label} href={link.href} className="block py-1 text-white/90 hover:text-orange-300 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <Link href="/auth/register" className="flex-1 border border-white/30 text-white py-2 rounded-md hover:bg-white/10 transition-colors text-center">Register</Link>
            <Link href="/auth/login" className="flex-1 bg-orange-500 text-white py-2 rounded-md font-medium hover:bg-orange-600 transition-colors text-center">Login</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
