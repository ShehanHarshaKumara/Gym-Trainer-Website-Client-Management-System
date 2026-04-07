import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'gym-trainer-admin-token'
export const ADMIN_STORAGE_KEY = 'gym-trainer-admin-user'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function getApiError(error: unknown, fallback = 'Something went wrong.') {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.errors?.email?.[0] ??
      fallback
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export function toLineSeparated(values: string[] | undefined | null) {
  return (values ?? []).join('\n')
}

export function fromLineSeparated(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function money(value: string | number | null | undefined) {
  const amount = Number(value ?? 0)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function prettyDate(value?: string | null) {
  if (!value) {
    return 'Not available'
  }

  return new Date(value).toLocaleDateString()
}
