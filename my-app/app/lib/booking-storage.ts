import { getCurrentUser } from './auth-storage'

export type StoredBooking = {
  id: string
  username: string
  trainName: string
  trainNumber: string
  classCode: string
  fromStation: string
  toStation: string
  journeyDate: string
  journeyDateISO: string
  departureTime: string
  arrivalTime: string
  duration: string
  paymentMethod: string
  totalFare: number
  passengerCount: number
  pnrNumber: string
  createdAt: number
}

const STORAGE_KEYS = {
  BOOKINGS: 'hci_mock_bookings',
}

export function getStoredBookings(): StoredBooking[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getBookingsForUsername(username: string): StoredBooking[] {
  const allBookings = getStoredBookings()
  return allBookings
    .filter((b) => b.username.toLowerCase() === username.toLowerCase())
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function addBookingForCurrentUser(bookingData: Omit<StoredBooking, 'id' | 'username' | 'createdAt'>): StoredBooking | null {
  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const newBooking: StoredBooking = {
    ...bookingData,
    id: crypto.randomUUID(),
    username: currentUser.username,
    createdAt: Date.now(),
  }

  const allBookings = getStoredBookings()
  allBookings.push(newBooking)

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(allBookings))
  }

  return newBooking
}

// Parses string date to a timestamp, fallback appropriately
export function parseBookingJourneyDate(booking: StoredBooking): number | null {
  if (booking.journeyDateISO) {
    const ts = new Date(booking.journeyDateISO).getTime()
    if (!Number.isNaN(ts)) return ts
  }

  // Best effort fallback for 'Fri, 13 Mar' type formats
  if (booking.journeyDate) {
    const currentYear = new Date().getFullYear()
    const parsed = new Date(`${booking.journeyDate} ${currentYear}`)
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime()
  }

  return null
}
