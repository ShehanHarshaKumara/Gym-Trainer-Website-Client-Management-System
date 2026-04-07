import {
  createContext,
  startTransition,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { api, getApiError } from './api'
import type { SitePayload } from './types'

type SiteContextValue = {
  site: SitePayload | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const SiteDataContext = createContext<SiteContextValue | null>(null)

export function SiteDataProvider({ children }: PropsWithChildren) {
  const [site, setSite] = useState<SitePayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const response = await api.get<{ data: SitePayload }>('/site')

      startTransition(() => {
        setSite(response.data.data)
      })
    } catch (fetchError) {
      setError(getApiError(fetchError, 'Could not load website content from the API.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo<SiteContextValue>(
    () => ({
      site,
      loading,
      error,
      refresh,
    }),
    [error, loading, refresh, site],
  )

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const context = useContext(SiteDataContext)

  if (!context) {
    throw new Error('Site data provider is missing.')
  }

  return context
}
