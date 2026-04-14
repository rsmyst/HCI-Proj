import type { DashboardData } from '../data/dashboard'

type Stat = DashboardData['stats'][number]

export default function InfoStrip({ stats }: { stats: Stat[] }) {
  return (
    <section className="bg-[#1a3c6e] text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-orange-400 font-display">{stat.value}</div>
              <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
