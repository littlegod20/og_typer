import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, getJson, postJson } from '../lib/api'
import type {
  ApiListResponse,
  Lesson,
  TextSample,
  TypingCompletePayload,
  TypingSessionResponseData,
} from '../types/api'
import { TypingPractice } from '../components/TypingPractice'
import { useAuth } from '../context/AuthContext'

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const { isAuthenticated } = useAuth()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [passage, setPassage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionMessage, setSessionMessage] = useState<string | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const sessionPostedRef = useRef(false)

  useEffect(() => {
    if (!lessonId) {
      setError('Missing lesson id')
      setLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await getJson<ApiListResponse<Lesson>>(
          `/api/lessons/${lessonId}`,
        )
        if (cancelled) return
        if (!res.success || !res.data) {
          setError(res.message ?? 'Lesson not found')
          setLesson(null)
          setPassage('')
          return
        }

        const L = res.data
        setLesson(L)

        let text = L.text_sample?.content ?? ''
        const sampleId = L.text_sample?.id

        if (!text && sampleId) {
          const sampleRes = await getJson<ApiListResponse<TextSample>>(
            `/api/text_samples/${sampleId}`,
          )
          if (cancelled) return
          if (sampleRes.success && sampleRes.data?.content) {
            text = sampleRes.data.content
          }
        }

        setPassage(text)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof ApiError ? e.message : 'Failed to load lesson')
        setLesson(null)
        setPassage('')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [lessonId])

  useEffect(() => {
    sessionPostedRef.current = false
    setSessionMessage(null)
    setSessionError(null)
  }, [lessonId, passage])

  const handleTypingComplete = useCallback(
    async (p: TypingCompletePayload) => {
      if (!isAuthenticated || !lessonId) return
      if (sessionPostedRef.current) return
      sessionPostedRef.current = true
      setSessionError(null)
      setSessionMessage(null)
      try {
        const res = await postJson<ApiListResponse<TypingSessionResponseData>>(
          '/api/me/typing-sessions',
          {
            lessonId,
            wpm: p.wpm,
            accuracy: p.accuracy,
            durationSeconds: p.durationSeconds,
            charactersTyped: p.typedLength,
            charactersCorrect: Math.max(0, p.typedLength - p.mistakes),
          },
        )
        if (!res.success) {
          setSessionError(res.message ?? 'Could not save session')
          sessionPostedRef.current = false
          return
        }
        if (res.data?.newBadges?.length) {
          setSessionMessage(
            `New badge${res.data.newBadges.length > 1 ? 's' : ''}: ${res.data.newBadges.map((b) => b.name).join(', ')}`,
          )
        } else {
          setSessionMessage('Progress saved.')
        }
      } catch (e) {
        sessionPostedRef.current = false
        setSessionError(
          e instanceof ApiError ? e.message : 'Could not save session',
        )
      }
    },
    [isAuthenticated, lessonId],
  )

  if (loading) {
    return <p className="text-zinc-500">Loading lesson…</p>
  }

  if (error || !lesson) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-red-200">
          {error ?? 'Lesson not found'}
        </div>
        <Link to="/courses" className="text-sm text-violet-400 hover:text-violet-300">
          ← Courses
        </Link>
      </div>
    )
  }

  const backHref = lesson.course?.id
    ? `/courses/${lesson.course.id}`
    : '/courses'

  return (
    <div className="space-y-6">
      <div>
        <Link to={backHref} className="text-sm text-violet-400 hover:text-violet-300">
          ← {lesson.course?.name ?? 'Courses'}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">{lesson.title}</h1>
        {lesson.description ? (
          <p className="mt-2 text-zinc-400">{lesson.description}</p>
        ) : null}
      </div>

      <TypingPractice
        key={`${lesson.id}-${passage.length}`}
        targetText={passage}
        title={lesson.text_sample?.title ?? undefined}
        onComplete={isAuthenticated ? handleTypingComplete : undefined}
      />
      {!isAuthenticated ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-500">
          Log in to save progress and earn badges.
        </p>
      ) : null}
      {sessionMessage ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          {sessionMessage}
        </p>
      ) : null}
      {sessionError ? (
        <p className="text-sm text-red-600 dark:text-red-400">{sessionError}</p>
      ) : null}
    </div>
  )
}
