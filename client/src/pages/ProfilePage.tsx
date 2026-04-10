import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ApiError, getJson, patchJson } from '../lib/api'
import type {
  ApiListResponse,
  Badge,
  EarnedBadgeEntry,
  ProfileUser,
  UserSettings,
  UserStatsSummary,
} from '../types/api'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const

const KEYBOARD_OPTIONS = [
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' },
] as const

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
] as const

export function ProfilePage() {
  const { isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<ProfileUser | null>(null)
  const [stats, setStats] = useState<UserStatsSummary | null>(null)
  const [catalog, setCatalog] = useState<Badge[]>([])
  const [earned, setEarned] = useState<EarnedBadgeEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const [theme, setTheme] = useState('light')
  const [keyboardSound, setKeyboardSound] = useState('on')
  const [difficulty, setDifficulty] = useState('beginner')
  const [wpmGoal, setWpmGoal] = useState('40')

  const applyThemeClass = useCallback((t: string) => {
    document.documentElement.classList.toggle('dark', t === 'dark')
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const [profRes, statsRes, badgesRes, mineRes] = await Promise.all([
          getJson<ApiListResponse<ProfileUser>>('/api/me/profile'),
          getJson<ApiListResponse<UserStatsSummary>>('/api/me/stats'),
          getJson<ApiListResponse<Badge[]>>('/api/badges'),
          getJson<ApiListResponse<EarnedBadgeEntry[]>>('/api/me/badges'),
        ])
        if (cancelled) return

        if (!profRes.success || !profRes.data) {
          setError(profRes.message ?? 'Could not load profile')
          return
        }
        setProfile(profRes.data)
        const s = profRes.data.user_settings
        if (s) {
          setTheme(s.theme)
          setKeyboardSound(s.keyboard_sound)
          setDifficulty(s.difficulty)
          setWpmGoal(s.words_per_minute_goal ?? '40')
          applyThemeClass(s.theme)
        }

        if (statsRes.success && statsRes.data) setStats(statsRes.data)
        if (badgesRes.success && badgesRes.data) setCatalog(badgesRes.data)
        if (mineRes.success && mineRes.data) setEarned(mineRes.data)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof ApiError ? e.message : 'Failed to load profile')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, applyThemeClass])

  const earnedIds = new Set(earned.map((e) => e.badge.id))

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault()
    setSettingsError(null)
    setSaving(true)
    try {
      const res = await patchJson<ApiListResponse<UserSettings | null>>(
        '/api/me/settings',
        {
          theme,
          keyboard_sound: keyboardSound,
          difficulty,
          words_per_minute_goal: wpmGoal,
        },
      )
      if (!res.success) {
        setSettingsError(res.message ?? 'Save failed')
        return
      }
      applyThemeClass(theme)
      if (res.data && profile) {
        setProfile({ ...profile, user_settings: res.data })
      }
    } catch (err) {
      setSettingsError(
        err instanceof ApiError ? err.message : 'Could not save settings',
      )
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <p className="text-zinc-500 dark:text-zinc-500">Loading profile…</p>
    )
  }

  if (error || !profile) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
        {error ?? 'Profile unavailable'}
      </div>
    )
  }

  const card =
    'rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/40'
  const heading2 = 'text-lg font-medium text-zinc-800 dark:text-zinc-200'
  const inputClass =
    'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Profile
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          {profile.username} · {profile.email}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className={heading2}>Stats</h2>
        {stats ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className={card}>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Sessions
              </dt>
              <dd className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                {stats.totalSessions}
              </dd>
            </div>
            <div className={card}>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Lessons completed
              </dt>
              <dd className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                {stats.lessonsCompleted}
              </dd>
            </div>
            <div className={card}>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Average WPM
              </dt>
              <dd className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                {stats.averageWpm}
              </dd>
            </div>
            <div className={card}>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Best WPM
              </dt>
              <dd className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                {stats.bestWpm}
              </dd>
            </div>
            <div className={`${card} sm:col-span-2`}>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Practice time
              </dt>
              <dd className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                {Math.round(stats.totalPracticeSeconds / 60)} min
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-zinc-500">No stats yet.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className={heading2}>Badges</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((b) => {
            const has = earnedIds.has(b.id)
            return (
              <li
                key={b.id}
                className={[
                  'rounded-xl border px-4 py-3',
                  has
                    ? 'border-violet-400/60 bg-violet-50 dark:border-violet-500/40 dark:bg-violet-950/20'
                    : 'border-zinc-200 bg-zinc-50 opacity-80 dark:border-zinc-800 dark:bg-zinc-900/30 dark:opacity-60',
                ].join(' ')}
              >
                <div className="text-2xl" aria-hidden>
                  {b.icon_url}
                </div>
                <div className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
                  {b.name}
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-500">
                  {b.description}
                </p>
                {has ? (
                  <p className="mt-2 text-xs font-medium text-violet-600 dark:text-violet-400">
                    Earned
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-600">
                    Locked
                  </p>
                )}
              </li>
            )
          })}
        </ul>
        {!catalog.length ? (
          <p className="text-zinc-500">No badges defined yet.</p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className={heading2}>Settings</h2>
        <form
          onSubmit={saveSettings}
          className="max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          {settingsError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {settingsError}
            </p>
          ) : null}
          <div>
            <label
              htmlFor="theme"
              className="mb-1 block text-sm text-zinc-600 dark:text-zinc-400"
            >
              Theme
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={inputClass}
            >
              {THEME_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="kbd"
              className="mb-1 block text-sm text-zinc-600 dark:text-zinc-400"
            >
              Keyboard sound
            </label>
            <select
              id="kbd"
              value={keyboardSound}
              onChange={(e) => setKeyboardSound(e.target.value)}
              className={inputClass}
            >
              {KEYBOARD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="diff"
              className="mb-1 block text-sm text-zinc-600 dark:text-zinc-400"
            >
              Default difficulty
            </label>
            <select
              id="diff"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={inputClass}
            >
              {DIFFICULTY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="wpm"
              className="mb-1 block text-sm text-zinc-600 dark:text-zinc-400"
            >
              WPM goal
            </label>
            <input
              id="wpm"
              type="text"
              value={wpmGoal}
              onChange={(e) => setWpmGoal(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </form>
      </section>
    </div>
  )
}
