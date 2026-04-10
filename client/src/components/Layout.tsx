import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass =
  'text-zinc-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded px-1'
const ctaClass =
  'rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950'

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-svh flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-violet-400 hover:text-violet-300"
          >
            OG Typer
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm">
            <Link to="/courses" className={linkClass}>
              Courses
            </Link>
            {isAuthenticated ? (
              <>
                <span className="max-w-[12rem] truncate text-zinc-500" title={user?.email}>
                  {user?.email}
                </span>
                <button type="button" onClick={logout} className={linkClass}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass}>
                  Log in
                </Link>
                <Link to="/register" className={ctaClass}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-800/80 py-4 text-center text-xs text-zinc-500">
        Practice typing with structured lessons.
      </footer>
    </div>
  )
}
