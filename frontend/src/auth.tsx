import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { api, ADMIN_STORAGE_KEY, getApiError, TOKEN_STORAGE_KEY } from './api'
import type { AdminUser } from './types'

type AuthContextValue = {
  admin: AdminUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_STORAGE_KEY),
  )
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const storedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY)
    return storedAdmin ? (JSON.parse(storedAdmin) as AdminUser) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function hydrateAdmin() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get<{ data: AdminUser }>('/admin/me')

        if (!ignore) {
          setAdmin(response.data.data)
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(response.data.data))
        }
      } catch {
        if (!ignore) {
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          localStorage.removeItem(ADMIN_STORAGE_KEY)
          setToken(null)
          setAdmin(null)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    void hydrateAdmin()

    return () => {
      ignore = true
    }
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({
      admin,
      token,
      loading,
      async login(email, password) {
        const response = await api.post<{ token: string; admin: AdminUser }>('/admin/login', {
          email,
          password,
        })

        localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token)
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(response.data.admin))
        setToken(response.data.token)
        setAdmin(response.data.admin)
      },
      async logout() {
        try {
          await api.post('/admin/logout')
        } catch {
          // Keep logout resilient even when the token has already expired.
        } finally {
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          localStorage.removeItem(ADMIN_STORAGE_KEY)
          setToken(null)
          setAdmin(null)
        }
      },
    }),
    [admin, loading, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(getApiError(new Error('Auth provider is missing.')))
  }

  return context
}
