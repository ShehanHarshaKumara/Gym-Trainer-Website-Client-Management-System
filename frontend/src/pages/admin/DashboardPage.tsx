import { useEffect, useState } from 'react'
import { api, getApiError } from '../../api'
import type { DashboardPayload } from '../../types'
import { AdminCard, AdminError, AdminLoader, SimpleList } from './shared'

export function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadDashboard() {
      try {
        setError(null)
        const response = await api.get<{ data: DashboardPayload }>('/admin/dashboard')

        if (!ignore) {
          setDashboard(response.data.data)
        }
      } catch (loadError) {
        if (!ignore) {
          setError(getApiError(loadError))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    void loadDashboard()

    return () => {
      ignore = true
    }
  }, [])

  if (loading) {
    return <AdminLoader label="Loading dashboard..." />
  }

  if (!dashboard) {
    return <AdminError message={error ?? 'Dashboard data is unavailable.'} />
  }

  const statEntries = [
    ['Packages', dashboard.stats.packages],
    ['Clients', dashboard.stats.clients],
    ['Inquiries', dashboard.stats.inquiries],
    ['Reviews', dashboard.stats.reviews],
    ['Pending Reviews', dashboard.stats.pending_feedback],
    ['Transformations', dashboard.stats.transformations],
  ] as const

  return (
    <div className="admin-section-stack">
      <section className="admin-page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Track website activity and keep an eye on review approvals and client growth.</p>
        </div>
      </section>

      <section className="admin-stat-grid">
        {statEntries.map(([label, value]) => (
          <div key={label} className="admin-stat-card">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="admin-grid two-up">
        <AdminCard title="Recent feedback">
          <SimpleList
            items={dashboard.recent_feedback.map((item) => ({
              title: `${item.client_name} · ${item.rating}/5`,
              subtitle: item.message,
              meta: item.status,
            }))}
          />
        </AdminCard>

        <AdminCard title="Recent inquiries">
          <SimpleList
            items={dashboard.recent_messages.map((item) => ({
              title: item.name,
              subtitle: item.message,
              meta: item.status,
            }))}
          />
        </AdminCard>
      </section>

      <section className="admin-grid">
        <AdminCard title="Newest clients">
          <SimpleList
            items={dashboard.recent_clients.map((item) => ({
              title: item.name,
              subtitle: item.goal,
              meta: item.selected_package?.name ?? 'No package assigned',
            }))}
          />
        </AdminCard>
      </section>
    </div>
  )
}
