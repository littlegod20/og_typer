import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, getJson } from '../lib/api'
import type { ApiListResponse, Course } from '../types/api'

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await getJson<ApiListResponse<Course[]>>('/api/courses')
        if (cancelled) return
        if (!res.success || !res.data) {
          setError(res.message ?? 'Could not load courses')
          setCourses([])
        } else {
          setCourses(res.data)
        }
      } catch (e) {
        if (cancelled) return
        setError(e instanceof ApiError ? e.message : 'Could not load courses')
        setCourses([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <p className="text-zinc-500">Loading courses…</p>
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-red-200">
        {error}
      </div>
    )
  }

  if (!courses?.length) {
    return <p className="text-zinc-500">No courses yet. Add some via the API.</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Courses</h1>
      <ul className="space-y-3">
        {courses.map((c) => (
          <li key={c.id}>
            <Link
              to={`/courses/${c.id}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-4 transition-colors hover:border-violet-500/40 hover:bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <span className="font-medium text-zinc-100">{c.name}</span>
              {c.description ? (
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                  {c.description}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
