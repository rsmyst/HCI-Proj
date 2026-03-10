'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300 px-4 py-10 sm:py-16 flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-colors mb-5"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-gray-100 tracking-tight">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
            Continue your travel planning with secure access.
          </p>
        </header>

        <form className="space-y-5" aria-label="Login form">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5"
            >
              User Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your user name"
              className="w-full rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-gray-300"
              >
                Password
              </label>
              <Link
                href="#"
                className="text-sm text-blue-700 dark:text-blue-400 hover:underline underline-offset-2"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 pr-11 text-sm text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-gray-400">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <span>Visually impaired login (OTP-based)</span>
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 hover:bg-blue-800 text-white py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-slate-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-blue-700 dark:text-blue-400 font-medium hover:underline underline-offset-2"
            >
              Create Account
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}