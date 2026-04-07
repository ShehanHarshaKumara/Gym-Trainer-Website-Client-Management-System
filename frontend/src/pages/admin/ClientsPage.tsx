import { useEffect, useState } from 'react'
import { api, getApiError, prettyDate } from '../../api'
import { useSiteData } from '../../site-data'
import type { ClientRecord } from '../../types'
import { AdminCard, AdminResourceLayout, DataTable, InlineField } from './shared'

type ClientFormState = {
  name: string
  age: string
  gender: string
  phone: string
  email: string
  goal: string
  selected_package_id: string
  joined_date: string
  notes: string
  progress_notes: string
}

const emptyClientForm: ClientFormState = {
  name: '',
  age: '',
  gender: '',
  phone: '',
  email: '',
  goal: '',
  selected_package_id: '',
  joined_date: '',
  notes: '',
  progress_notes: '',
}

export function AdminClientsPage() {
  const { site } = useSiteData()
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<ClientFormState>(emptyClientForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  async function loadClients() {
    setLoading(true)
    try {
      const response = await api.get<{ data: ClientRecord[] }>('/admin/clients')
      setClients(response.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadClients()
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const payload = {
      ...form,
      age: form.age ? Number(form.age) : null,
      selected_package_id: form.selected_package_id ? Number(form.selected_package_id) : null,
    }

    try {
      if (editingId) {
        await api.put(`/admin/clients/${editingId}`, payload)
        setNotice({ tone: 'success', message: 'Client updated successfully.' })
      } else {
        await api.post('/admin/clients', payload)
        setNotice({ tone: 'success', message: 'Client created successfully.' })
      }

      setEditingId(null)
      setForm(emptyClientForm)
      await loadClients()
    } catch (error) {
      setNotice({ tone: 'error', message: getApiError(error) })
    }
  }

  return (
    <AdminResourceLayout
      title="Client Management"
      description="Track joined clients, their goals, and package assignments."
      loading={loading}
    >
      <AdminCard title="Client details">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <InlineField label="Client name">
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </InlineField>
          <InlineField label="Age">
            <input value={form.age} onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))} />
          </InlineField>
          <InlineField label="Gender">
            <input value={form.gender} onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))} />
          </InlineField>
          <InlineField label="Phone">
            <input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
          </InlineField>
          <InlineField label="Email">
            <input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
          </InlineField>
          <InlineField label="Joined date">
            <input type="date" value={form.joined_date} onChange={(event) => setForm((prev) => ({ ...prev, joined_date: event.target.value }))} />
          </InlineField>
          <InlineField label="Assigned package">
            <select value={form.selected_package_id} onChange={(event) => setForm((prev) => ({ ...prev, selected_package_id: event.target.value }))}>
              <option value="">Select package</option>
              {site?.packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </InlineField>
          <InlineField label="Goal" full>
            <input value={form.goal} onChange={(event) => setForm((prev) => ({ ...prev, goal: event.target.value }))} />
          </InlineField>
          <InlineField label="Notes" full>
            <textarea value={form.notes} rows={3} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} />
          </InlineField>
          <InlineField label="Progress notes" full>
            <textarea value={form.progress_notes} rows={3} onChange={(event) => setForm((prev) => ({ ...prev, progress_notes: event.target.value }))} />
          </InlineField>
          {notice && <div className={`inline-alert ${notice.tone}`}>{notice.message}</div>}
          <div className="hero-actions">
            <button className="button button-primary" type="submit">
              {editingId ? 'Update client' : 'Create client'}
            </button>
            <button className="button button-ghost" type="button" onClick={() => { setEditingId(null); setForm(emptyClientForm) }}>
              Reset form
            </button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title="Client records">
        <DataTable
          headers={['Client', 'Goal', 'Package', 'Joined', 'Actions']}
          rows={clients.map((item) => [
            item.name,
            item.goal,
            item.selected_package?.name ?? 'Not assigned',
            prettyDate(item.joined_date),
            <div key={`${item.id}-actions`} className="table-actions">
              <button
                className="button button-ghost"
                type="button"
                onClick={() => {
                  setEditingId(item.id)
                  setForm({
                    name: item.name,
                    age: item.age ? String(item.age) : '',
                    gender: item.gender ?? '',
                    phone: item.phone ?? '',
                    email: item.email ?? '',
                    goal: item.goal,
                    selected_package_id: item.selected_package_id ? String(item.selected_package_id) : '',
                    joined_date: item.joined_date,
                    notes: item.notes ?? '',
                    progress_notes: item.progress_notes ?? '',
                  })
                }}
              >
                Edit
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={async () => {
                  await api.delete(`/admin/clients/${item.id}`)
                  await loadClients()
                }}
              >
                Delete
              </button>
            </div>,
          ])}
        />
      </AdminCard>
    </AdminResourceLayout>
  )
}
