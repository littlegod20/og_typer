import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(username, email, password)
      navigate('/login', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body as {
          msg?: string
          message?: string
          errors?: Array<{ property: string; constraints?: Record<string, string> }>
        }
        const validation =
          body.errors
            ?.map(
              (x) =>
                `${x.property}: ${x.constraints ? Object.values(x.constraints).join(', ') : ''}`,
            )
            .join('; ') ?? ''
        setError(
          validation ||
            body.msg ||
            body.message ||
            err.message ||
            'Registration failed',
        )
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-semibold text-white">Create account</h1>
      <p className="text-sm text-zinc-500">
        Username: letters, numbers, underscores only. Password: at least 6
        characters with one letter and one number.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}
        <div>
          <label htmlFor="username" className="mb-1 block text-sm text-zinc-400">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            required
            minLength={2}
            pattern="^\w+$"
            title="Letters, numbers, and underscores only"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <div>
          <label htmlFor="reg-email" className="mb-1 block text-sm text-zinc-400">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <div>
          <label htmlFor="reg-password" className="mb-1 block text-sm text-zinc-400">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          {submitting ? 'Creating…' : 'Register'}
        </button>
      </form>
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link to="/login" className="text-violet-400 hover:text-violet-300">
          Log in
        </Link>
      </p>
    </div>
  )
}
