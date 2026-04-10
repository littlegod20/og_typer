import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, getJson } from '../lib/api'
import type { ApiListResponse, Course, Lesson } from '../types/api'

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!courseId) {
      setError('Missing course id')
      setLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          getJson<ApiListResponse<Course>>(`/api/courses/${courseId}`),
          getJson<ApiListResponse<Lesson[]>>(
            `/api/lessons?courseId=${encodeURIComponent(courseId)}`,
          ),
        ])
        if (cancelled) return

        if (!courseRes.success || !courseRes.data) {
          setError(courseRes.message ?? 'Course not found')
          setCourse(null)
        } else {
          setCourse(courseRes.data)
        }

        if (!lessonsRes.success || !lessonsRes.data) {
          setLessons([])
        } else {
          setLessons(lessonsRes.data)
        }
      } catch (e) {
        if (cancelled) return
        setError(e instanceof ApiError ? e.message : 'Failed to load course')
        setCourse(null)
        setLessons([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [courseId])

  if (loading) {
    return <p className="text-zinc-500">Loading…</p>
  }

  if (error || !course) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-red-200">
          {error ?? 'Course not found'}
        </div>
        <Link to="/courses" className="text-sm text-violet-400 hover:text-violet-300">
          ← Back to courses
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/courses"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          ← All courses
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">{course.name}</h1>
        {course.description ? (
          <p className="mt-2 text-zinc-400">{course.description}</p>
        ) : null}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-zinc-200">Lessons</h2>
        {!lessons?.length ? (
          <p className="text-zinc-500">No lessons in this course yet.</p>
        ) : (
          <ol className="space-y-2">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  to={`/lessons/${lesson.id}`}
                  className="flex items-baseline justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-3 hover:border-violet-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <span className="font-medium text-zinc-100">
                    <span className="mr-2 text-zinc-500">{lesson.order_index}.</span>
                    {lesson.title}
                  </span>
                  {lesson.text_sample?.difficulty_level ? (
                    <span className="shrink-0 text-xs uppercase tracking-wide text-zinc-500">
                      {lesson.text_sample.difficulty_level}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
