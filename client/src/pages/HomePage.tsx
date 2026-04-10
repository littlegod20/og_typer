import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Sharpen your typing
        </h1>
        <p className="max-w-xl text-zinc-400">
          Browse courses, open a lesson, and practice on real passages. Create an
          account when you want to save progress for future features.
        </p>
      </div>
      <Link
        to="/courses"
        className="inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        View courses
      </Link>
    </div>
  )
}
