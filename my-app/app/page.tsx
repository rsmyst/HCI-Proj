import { headers } from 'next/headers'
import AlertBanner from './components/AlertBanner'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ServicesSection from './components/ServicesSection'
import InfoStrip from './components/InfoStrip'
import PromoBanner from './components/PromoBanner'
import QuickActions from './components/QuickActions'
import HelpSection from './components/HelpSection'
import Footer from './components/Footer'
import AccessibilityWidget from './components/AccessibilityWidget'
import { dashboardData, type DashboardData } from './data/dashboard'

async function getDashboardData(): Promise<DashboardData> {
  try {
    const headersList = await headers()
    const host = headersList.get('host')
    const baseUrl = host
      ? `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${host}`
      : process.env.NEXT_PUBLIC_SITE_URL

    if (!baseUrl) return dashboardData

    const response = await fetch(`${baseUrl}/api/dashboard`, { cache: 'no-store' })
    if (!response.ok) return dashboardData
    return (await response.json()) as DashboardData
  } catch {
    return dashboardData
  }
}

export default async function Home() {
  const data = await getDashboardData()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <a
        href="#booking"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow"
      >
        Skip to booking
      </a>
      <AlertBanner alert={data.alerts[0]} />
      <Navbar />
      <HeroSection hero={data.hero} booking={data.booking} />
      <QuickActions actions={data.quickActions} />
      <ServicesSection services={data.services} />
      <InfoStrip stats={data.stats} />
      <PromoBanner offers={data.offers} />
      <HelpSection faqs={data.faqs} />
      <Footer />
      <AccessibilityWidget />
    </div>
  )
}
