import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ACCESS_TOKEN_STORAGE_KEY,
  postJson,
  setStoredAccessToken,
} from '../lib/api'
import type { ApiUser, AuthTokens } from '../types/api'

const USER_KEY = 'og_typer_user'
const REFRESH_KEY = 'og_typer_refresh_token'

type AuthState = {
  user: ApiUser | null
  accessToken: string | null
  refreshToken: string | null
}

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadInitialState(): AuthState {
  try {
    const raw = localStorage.getItem(USER_KEY)
    const refresh = localStorage.getItem(REFRESH_KEY)
    const access = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    if (!raw) {
      return { user: null, accessToken: access, refreshToken: refresh }
    }
    const user = JSON.parse(raw) as ApiUser
    return { user, accessToken: access, refreshToken: refresh }
  } catch {
    return { user: null, accessToken: null, refreshToken: null }
  }
}

function persistTokens(user: ApiUser | null, tokens: AuthTokens | null) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
    if (tokens?.refreshToken)
      localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
    else localStorage.removeItem(REFRESH_KEY)
    setStoredAccessToken(tokens?.accessToken ?? null)
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitialState)

  const logout = useCallback(() => {
    setState({ user: null, accessToken: null, refreshToken: null })
    persistTokens(null, null)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await postJson<{
      user?: ApiUser
      tokens?: AuthTokens
      msg?: string
      message?: string
      success?: boolean
    }>('/auth/login', { email, password })

    if (!data.user || !data.tokens) {
      throw new Error(data.msg ?? data.message ?? 'Login failed')
    }

    setState({
      user: data.user,
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken,
    })
    persistTokens(data.user, data.tokens)
  }, [])

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const data = await postJson<{
        user?: ApiUser
        redirect?: string
        msg?: string
      }>('/auth/register', { username, email, password })

      if (data.msg && !data.user) {
        throw new Error(data.msg)
      }
      if (!data.user) {
        throw new Error('Registration did not return a user')
      }
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
      isAuthenticated: Boolean(state.user && state.accessToken),
    }),
    [state, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* Hook lives here with the provider; fast-refresh prefers single-export files. */
// eslint-disable-next-line react-refresh/only-export-components -- useAuth is the public API for this module
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
