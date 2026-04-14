import type { DashboardData } from '../data/dashboard'

type Offer = DashboardData['offers'][number]

const toneStyles = {
  blue: {
    card: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/50',
    tag: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  },
  orange: {
    card: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800/50',
    tag: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  },
  green: {
    card: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800/50',
    tag: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  },
}

export default function PromoBanner({ offers }: { offers: Offer[] }) {
  return (
    <section id="offers" className="bg-slate-50 dark:bg-gray-950 py-14 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-display">Offers &amp; Updates</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Latest deals and announcements from Indian Railways</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {offers.map((offer) => (
            <div
              key={offer.title}
              className={`rounded-xl border p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ${toneStyles[offer.tone].card}`}
            >
              <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${toneStyles[offer.tone].tag}`}>
                {offer.tag}
              </span>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{offer.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{offer.desc}</p>
              </div>
              <a href="#" className="text-sm font-medium text-[#1a3c6e] dark:text-blue-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors mt-auto">
                Learn more &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
