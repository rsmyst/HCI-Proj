'use client'

type LoginErrorProps = {
	error: Error & { digest?: string }
	reset: () => void
}

export default function LoginError({ error, reset }: LoginErrorProps) {
	return (
		<main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300 flex items-center justify-center px-4">
			<section className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 text-center shadow-sm">
				<h2 className="text-lg font-semibold text-slate-900 dark:text-gray-100">Something went wrong</h2>
				<p className="mt-2 text-sm text-slate-600 dark:text-gray-400">{error.message || 'Unable to load login page.'}</p>
				<button
					onClick={reset}
					className="mt-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 text-sm font-medium transition-colors"
				>
					Try again
				</button>
			</section>
		</main>
	)
}
