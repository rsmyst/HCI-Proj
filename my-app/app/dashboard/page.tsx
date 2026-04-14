'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { clearCurrentUser, getCurrentUser, type StoredUser } from '../lib/auth-storage'
import {
  getBookingsForUsername,
  parseBookingJourneyDate,
  type StoredBooking,
} from '../lib/booking-storage'

function formatJourneyDate(booking: StoredBooking) {
  const sourceDate = booking.journeyDateISO || booking.journeyDate
  if (!sourceDate) return booking.journeyDate

  const parsedDate = new Date(sourceDate)
  if (Number.isNaN(parsedDate.getTime())) return booking.journeyDate

  return parsedDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null)
  const [bookings, setBookings] = useState<StoredBooking[]>([])
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()

    if (!user) {
      router.replace('/auth/login')
      return
    }

    const hydrateTimer = window.setTimeout(() => {
      setCurrentUser(user)
      setBookings(getBookingsForUsername(user.username))
    }, 0)

    return () => window.clearTimeout(hydrateTimer)
  }, [router])

  const handleLogout = () => {
    clearCurrentUser()
    router.replace('/')
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Loading dashboard...
      </main>
    )
  }

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const upcomingBookings = bookings.filter((booking) => {
    const journeyTime = parseBookingJourneyDate(booking)
    if (!journeyTime) return false
    return journeyTime >= now.getTime()
  })

  const pastBookings = bookings.filter((booking) => {
    const journeyTime = parseBookingJourneyDate(booking)
    if (!journeyTime) return true
    return journeyTime < now.getTime()
  })

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 px-4 py-10 sm:py-16 transition-colors duration-300">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl bg-[#1a3c6e] text-white shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-10 grid gap-6 md:grid-cols-[1.4fr_0.9fr] items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Signed in dashboard</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                Welcome back, {currentUser.fullName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-blue-100">
                Continue booking, search for a different train, or jump back into the itinerary you were already exploring.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/search" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1a3c6e] transition-transform hover:scale-[1.02]">
                  Search trains
                </Link>
                <Link href="/booking" className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  Continue booking
                </Link>
                <button type="button" onClick={handleLogout} className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                  Logout
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
              <h2 className="text-sm font-semibold text-white">Account summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="text-blue-100">User name</dt>
                  <dd className="font-medium">{currentUser.username}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="text-blue-100">Email</dt>
                  <dd className="font-medium text-right break-all">{currentUser.email}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="text-blue-100">Mobile</dt>
                  <dd className="font-medium">+{currentUser.countryCode.replace('+', '')} {currentUser.mobile}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-blue-100">Joined</dt>
                  <dd className="font-medium">{new Date(currentUser.createdAt).toLocaleDateString('en-IN')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming bookings</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                {upcomingBookings.length}
              </span>
            </div>

            {upcomingBookings.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600 dark:text-gray-400">
                No upcoming journeys yet. Book a train and it will appear here.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {booking.trainName} ({booking.trainNumber})
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                          {booking.fromStation} {'->'} {booking.toStation}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                        PNR {booking.pnrNumber}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-gray-400">
                      <p>Date: <span className="font-medium text-slate-900 dark:text-gray-200">{formatJourneyDate(booking)}</span></p>
                      <p>Class: <span className="font-medium text-slate-900 dark:text-gray-200">{booking.classCode}</span></p>
                      <p>Passengers: <span className="font-medium text-slate-900 dark:text-gray-200">{booking.passengerCount}</span></p>
                      <p>Total: <span className="font-medium text-slate-900 dark:text-gray-200">₹ {booking.totalFare.toLocaleString('en-IN')}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Past bookings</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-gray-800 dark:text-gray-300">
                {pastBookings.length}
              </span>
            </div>

            {pastBookings.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600 dark:text-gray-400">
                No previous bookings found for this account.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {booking.trainName} ({booking.trainNumber})
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                          {booking.fromStation} {'->'} {booking.toStation}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-gray-300">
                        PNR {booking.pnrNumber}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-gray-400">
                      <p>Date: <span className="font-medium text-slate-900 dark:text-gray-200">{formatJourneyDate(booking)}</span></p>
                      <p>Class: <span className="font-medium text-slate-900 dark:text-gray-200">{booking.classCode}</span></p>
                      <p>Passengers: <span className="font-medium text-slate-900 dark:text-gray-200">{booking.passengerCount}</span></p>
                      <p>Total: <span className="font-medium text-slate-900 dark:text-gray-200">₹ {booking.totalFare.toLocaleString('en-IN')}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Search trains</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              Change source, destination, or date before choosing a different train.
            </p>
            <Link href="/search" className="mt-5 inline-flex rounded-xl bg-[#1a3c6e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#214b86]">
              Open search
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Continue booking</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              Resume the default booking flow or jump into the currently selected train details.
            </p>
            <Link href="/booking" className="mt-5 inline-flex rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
              Open booking
            </Link>
          </article>
        </section>
      </div>
    </main>
  )
}