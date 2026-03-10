export default function LoginLoading() {
	return (
		<main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300 flex items-center justify-center px-4">
			<section className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-8 shadow-sm">
				<div className="h-6 w-40 bg-slate-200 dark:bg-gray-800 rounded animate-pulse mx-auto" />
				<div className="mt-6 space-y-4">
					<div className="h-10 bg-slate-200 dark:bg-gray-800 rounded animate-pulse" />
					<div className="h-10 bg-slate-200 dark:bg-gray-800 rounded animate-pulse" />
					<div className="h-10 bg-slate-200 dark:bg-gray-800 rounded animate-pulse" />
				</div>
			</section>
		</main>
	)
}
