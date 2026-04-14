import BookingWidget from './BookingWidget'
import type { DashboardData } from '../data/dashboard'

type HeroProps = {
  hero: DashboardData['hero']
  booking: DashboardData['booking']
}

export default function HeroSection({ hero, booking }: HeroProps) {
  return (
    <section id="booking" className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom"
        style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1b34]/85 via-[#0b1b34]/70 to-[#0b1b34]/90" />
      <div className="absolute inset-0 bg-rail-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 items-start">
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs text-blue-100 border border-white/15 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold">{hero.statusLabel}:</span>
              <span>{hero.statusDetail}</span>
            </div>

            <div className="space-y-3 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-semibold font-display tracking-tight">
                {hero.title}
              </h1>
              <p className="text-base md:text-lg text-blue-100 max-w-xl">
                {hero.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 animate-fade-in-up">
              {hero.trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-xs text-blue-100"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 animate-fade-in-up">
              <a
                href="#booking"
                className="bg-amber-500 hover:bg-amber-400 text-[#1a2438] font-semibold px-5 py-3 rounded-xl shadow-lg transition-all animate-sheen"
              >
                {hero.primaryCta}
              </a>
              <a
                href="#booking"
                className="border border-white/30 text-white px-5 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                {hero.secondaryCta}
              </a>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 animate-fade-in-up">
              <p className="text-xs uppercase tracking-widest text-blue-200 mb-2">Input guidance</p>
              <ul className="space-y-2 text-sm text-blue-100">
                {booking.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl border border-white/15 p-4 lg:p-5 shadow-2xl card-glow">
            <BookingWidget popularRoutes={booking.popularRoutes} />
          </div>
        </div>
      </div>
    </section>
  )
}
