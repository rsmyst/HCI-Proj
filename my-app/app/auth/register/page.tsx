'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

type FormData = {
  username: string
  fullName: string
  password: string
  confirmPassword: string
  email: string
  countryCode: string
  mobile: string
  captcha: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

function generateCaptcha() {
  const first = Math.floor(Math.random() * 8) + 1
  const second = Math.floor(Math.random() * 8) + 1

  return {
    question: `What is ${first} + ${second}?`,
    answer: String(first + second),
  }
}

const initialCaptcha = {
  question: 'What is 2 + 3?',
  answer: '5',
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [captchaChallenge, setCaptchaChallenge] = useState(initialCaptcha)
  const [errors, setErrors] = useState<FormErrors>({})
  const [statusMessage, setStatusMessage] = useState('')
  const [formData, setFormData] = useState<FormData>({
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    email: '',
    countryCode: '+91',
    mobile: '',
    captcha: '',
  })
  const router = useRouter()

  useEffect(() => {
    setCaptchaChallenge(generateCaptcha())
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }))

    setStatusMessage('')
  }

  const refreshCaptcha = () => {
    setCaptchaChallenge(generateCaptcha())
    setFormData((prev) => ({ ...prev, captcha: '' }))
    setErrors((prev) => ({ ...prev, captcha: undefined }))
    setStatusMessage('Captcha refreshed.')
  }

  const validateForm = () => {
    const nextErrors: FormErrors = {}

    if (!formData.username.trim()) nextErrors.username = 'User Name is required.'
    if (!formData.fullName.trim()) nextErrors.fullName = 'Full Name is required.'

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.'
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formData.mobile.trim()) {
      nextErrors.mobile = 'Mobile number is required.'
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      nextErrors.mobile = 'Enter a valid 10-digit mobile number.'
    }

    if (!formData.captcha.trim()) {
      nextErrors.captcha = 'Captcha answer is required.'
    } else if (formData.captcha.trim() !== captchaChallenge.answer) {
      nextErrors.captcha = 'Captcha answer is incorrect.'
    }

    return nextErrors
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateForm()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage('Please correct the highlighted fields.')
      return
    }

    setStatusMessage('Registration form validated successfully.')
  }

  const getInputClassName = (field: keyof FormData) =>
    `w-full rounded-lg border bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition-colors ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-slate-300 dark:border-gray-700 focus:border-blue-500'
    }`

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300 px-4 py-10 sm:py-16 flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mb-5 rounded-md bg-blue-700 text-white px-3 py-1.5 text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          Back
        </button>

        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-gray-100 tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
            Join to book and manage your travel easily.
          </p>
        </header>

        <form className="space-y-5" aria-label="Registration form" noValidate onSubmit={handleSubmit}>
          {statusMessage && (
            <div
              aria-live="polite"
              className="rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-4 py-3 text-sm text-slate-700 dark:text-gray-200"
            >
              {statusMessage}
            </div>
          )}

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
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a user name"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? 'username-error' : undefined}
              className={getInputClassName('username')}
            />
            {errors.username && (
              <p id="username-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                {errors.username}
              </p>
            )}
          </div>

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
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={getInputClassName('fullName')}
            />
            {errors.fullName && (
              <p id="fullName-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                {errors.fullName}
              </p>
            )}
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : 'password-help'}
                className={`${getInputClassName('password')} pr-11`}
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
            <p id="password-help" className="mt-1.5 text-xs text-slate-500 dark:text-gray-400">
              Use at least 8 characters.
            </p>
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                {errors.password}
              </p>
            )}
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
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                className={`${getInputClassName('confirmPassword')} pr-11`}
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
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
            Invalid email ID may lead to deactivation of IRCTC account.
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={getInputClassName('email')}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="countryCode"
              className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5"
            >
              Country / ISD Code
            </label>
            <select
              id="countryCode"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className={getInputClassName('countryCode')}
            >
              <option value="+91">+91 - India</option>
              <option value="+1">+1 - United States</option>
              <option value="+44">+44 - United Kingdom</option>
              <option value="+61">+61 - Australia</option>
            </select>
          </div>

          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
            Please submit Mobile Number without ISD Code.
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5"
            >
              Mobile
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              autoComplete="tel-national"
              inputMode="numeric"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              aria-invalid={Boolean(errors.mobile)}
              aria-describedby={errors.mobile ? 'mobile-error' : 'mobile-help'}
              className={getInputClassName('mobile')}
            />
            <p id="mobile-help" className="mt-1.5 text-xs text-slate-500 dark:text-gray-400">
              Enter digits only, without country code.
            </p>
            {errors.mobile && (
              <p id="mobile-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                {errors.mobile}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/70 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium text-slate-900 dark:text-gray-100">Accessible captcha</h2>
                <p id="captcha-help" className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                  Solve this simple math question. It is text-based and readable by screen readers.
                </p>
              </div>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-gray-600 px-3 py-2 text-sm text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Refresh captcha question"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <p
              aria-live="polite"
              className="rounded-lg bg-white dark:bg-gray-900 border border-dashed border-slate-300 dark:border-gray-600 px-4 py-3 text-base font-medium text-slate-900 dark:text-gray-100"
            >
              {captchaChallenge.question}
            </p>

            <div>
              <label
                htmlFor="captcha"
                className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5"
              >
                Captcha Answer
              </label>
              <input
                id="captcha"
                name="captcha"
                type="text"
                inputMode="numeric"
                value={formData.captcha}
                onChange={handleChange}
                placeholder="Enter the answer"
                aria-invalid={Boolean(errors.captcha)}
                aria-describedby={errors.captcha ? 'captcha-error captcha-help' : 'captcha-help'}
                className={getInputClassName('captcha')}
              />
              {errors.captcha && (
                <p id="captcha-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                  {errors.captcha}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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

