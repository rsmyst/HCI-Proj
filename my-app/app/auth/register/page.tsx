'use client'

import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300 px-4 py-10 sm:py-16 flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-gray-100 tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
            Join to book and manage your travel easily.
          </p>
        </header>

        <form className="space-y-5" aria-label="Registration form">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500 transition-colors"
            />
          </div>

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
              placeholder="Choose a user name"
              className="w-full rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create a password"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 pr-11 text-sm text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 transition-colors"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 hover:bg-blue-800 text-white py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-slate-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-blue-700 dark:text-blue-400 font-medium hover:underline underline-offset-2"
            >
              Sign In
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

