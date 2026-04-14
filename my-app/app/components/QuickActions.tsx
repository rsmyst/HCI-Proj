import type { DashboardData } from '../data/dashboard'

const iconMap = {
  ticket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 010 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 010-4V8z" />
      <path d="M8 8v8" />
    </svg>
  ),
  refund: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M21 12a9 9 0 11-2.64-6.36" />
      <path d="M21 3v6h-6" />
      <path d="M7 13h6" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
}

type QuickAction = DashboardData['quickActions'][number]

export default function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <section id="manage" className="bg-white/80 dark:bg-gray-900/60 backdrop-blur py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 font-display">
              Quick actions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fewer choices, larger targets, faster decisions.
            </p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Designed for touch and keyboard navigation.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {actions.map((action, index) => (
            <a
              key={action.id}
              href={action.href}
              className="group rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                {iconMap[action.icon]}
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {action.desc}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1a3c6e] dark:text-blue-300">
                {action.cta}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
