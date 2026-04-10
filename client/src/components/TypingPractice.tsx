import { useCallback, useEffect, useRef, useState } from 'react'
import type { TypingCompletePayload } from '../types/api'

type TypingPracticeProps = {
  targetText: string
  title?: string
  onComplete?: (payload: TypingCompletePayload) => void
}

export function TypingPractice({ targetText, title, onComplete }: TypingPracticeProps) {
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [finishedAt, setFinishedAt] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const areaRef = useRef<HTMLDivElement>(null)
  const completeFiredRef = useRef(false)

  const complete = typed === targetText && targetText.length > 0

  const elapsedSec =
    complete && startedAt != null && finishedAt != null
      ? (finishedAt - startedAt) / 1000
      : null

  const wpm =
    complete && elapsedSec != null && elapsedSec > 0
      ? Math.round(
          (targetText.split(/\s+/).filter(Boolean).length / elapsedSec) * 60,
        )
      : null

  const accuracy =
    typed.length > 0
      ? Math.round(
          ((typed.length - mistakes) / Math.max(typed.length, 1)) * 100,
        )
      : null

  const reset = useCallback(() => {
    completeFiredRef.current = false
    setTyped('')
    setStartedAt(null)
    setFinishedAt(null)
    setMistakes(0)
    areaRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!complete) {
      completeFiredRef.current = false
      return
    }
    if (!onComplete || completeFiredRef.current) return
    if (wpm == null || accuracy == null || elapsedSec == null) return
    completeFiredRef.current = true
    onComplete({
      wpm,
      accuracy,
      durationSeconds: elapsedSec,
      typedLength: typed.length,
      mistakes,
    })
  }, [
    complete,
    onComplete,
    wpm,
    accuracy,
    elapsedSec,
    typed.length,
    mistakes,
  ])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (complete) return

      if (e.key === 'Backspace') {
        e.preventDefault()
        setTyped((t) => t.slice(0, -1))
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        reset()
        return
      }

      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
        return
      }

      e.preventDefault()
      if (typed.length >= targetText.length) return

      if (startedAt === null) setStartedAt(Date.now())

      const expected = targetText[typed.length]
      if (e.key !== expected) {
        setMistakes((m) => m + 1)
      }

      const next = typed + e.key
      setTyped(next)
      if (next === targetText) {
        setFinishedAt(Date.now())
      }
    },
    [complete, typed, targetText, startedAt, reset],
  )

  if (!targetText) {
    return (
      <p className="text-zinc-500">No passage text is available for this lesson.</p>
    )
  }

  return (
    <div className="space-y-4">
      {title ? (
        <h2 className="text-xl font-medium text-zinc-100">{title}</h2>
      ) : null}

      <div
        ref={areaRef}
        role="textbox"
        tabIndex={0}
        aria-label="Typing practice area"
        className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 outline-none ring-violet-500/0 transition-shadow focus-visible:ring-2"
        onKeyDown={onKeyDown}
      >
        <p className="mb-3 text-xs text-zinc-500">
          Click here and type. Backspace to correct. Esc to reset.
        </p>
        <div
          className="font-mono text-lg leading-relaxed tracking-wide break-words"
          aria-hidden
        >
          {targetText.split('').map((ch, i) => {
            const isTyped = i < typed.length
            const isCurrent = i === typed.length && !complete
            const correct = isTyped && typed[i] === ch
            return (
              <span
                key={i}
                className={[
                  isCurrent ? 'border-l-2 border-violet-400' : '',
                  !isTyped
                    ? 'text-zinc-500'
                    : correct
                      ? 'text-emerald-400'
                      : 'text-red-400 underline decoration-red-400/60',
                ].join(' ')}
              >
                {ch === ' ' ? '\u00a0' : ch}
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
        {elapsedSec != null ? (
          <span>Time: {elapsedSec.toFixed(1)}s</span>
        ) : null}
        {wpm != null ? <span>WPM: {wpm}</span> : null}
        {accuracy != null ? <span>Accuracy: {accuracy}%</span> : null}
        {complete ? (
          <span className="font-medium text-emerald-400">Complete</span>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="ml-auto rounded-lg border border-zinc-600 px-3 py-1.5 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
