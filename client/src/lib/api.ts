import type { ApiErrorBody } from '../types/api'

export const ACCESS_TOKEN_STORAGE_KEY = 'og_typer_access_token'

function baseUrl(): string {
  return import.meta.env.VITE_API_BASE ?? ''
}

export function getStoredAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredAccessToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
    else localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

function formatValidationMessage(body: ApiErrorBody): string | undefined {
  if (!body.errors?.length) return undefined
  return body.errors
    .map((e) => {
      const c = e.constraints ? Object.values(e.constraints).join(', ') : ''
      return `${e.property}: ${c}`
    })
    .join('; ')
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${baseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getStoredAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(url, { ...init, headers })
  const text = await res.text()
  let json: unknown = null
  if (text) {
    try {
      json = JSON.parse(text) as unknown
    } catch {
      json = { raw: text }
    }
  }

  if (!res.ok) {
    const b = (json ?? {}) as ApiErrorBody
    const msg =
      b.message ??
      b.msg ??
      formatValidationMessage(b) ??
      res.statusText ??
      'Request failed'
    throw new ApiError(msg, res.status, json)
  }

  return json as T
}

export async function getJson<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'GET' })
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function patchJson<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
