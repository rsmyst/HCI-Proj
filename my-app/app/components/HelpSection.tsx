import type { DashboardData } from '../data/dashboard'

type Faq = DashboardData['faqs'][number]

export default function HelpSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="help" className="bg-slate-50 dark:bg-gray-950 py-14">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 font-display">
            Help built on HCI principles
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Progressive disclosure keeps the interface clean while still answering common questions.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 p-4"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">&#9660;</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
