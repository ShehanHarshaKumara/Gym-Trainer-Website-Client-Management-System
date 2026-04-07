import { useEffect, useState } from 'react'
import { api, getApiError } from '../../api'
import { useSiteData } from '../../site-data'
import type { ClientRecord, TransformationRecord } from '../../types'
import { AdminCard, AdminResourceLayout, DataTable, InlineField, StatusBadge } from './shared'

type TransformationFormState = {
  title: string
  client_id: string
  before_image_url: string
  after_image_url: string
  duration: string
  weight_change: string
  goals_achieved: string
  result_description: string
  success_story: string
  status: 'published' | 'draft'
  featured: boolean
}

const emptyTransformationForm: TransformationFormState = {
  title: '',
  client_id: '',
  before_image_url: '',
  after_image_url: '',
  duration: '',
  weight_change: '',
  goals_achieved: '',
  result_description: '',
  success_story: '',
  status: 'published',
  featured: true,
}

export function AdminTransformationsPage() {
  const { refresh: refreshSiteData } = useSiteData()
  const [transformations, setTransformations] = useState<TransformationRecord[]>([])
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<TransformationFormState>(emptyTransformationForm)
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  async function loadResources() {
    setLoading(true)
    try {
      const [transformationsResponse, clientsResponse] = await Promise.all([
        api.get<{ data: TransformationRecord[] }>('/admin/transformations'),
        api.get<{ data: ClientRecord[] }>('/admin/clients'),
      ])
      setTransformations(transformationsResponse.data.data)
      setClients(clientsResponse.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadResources()
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const payload = {
      ...form,
      client_id: form.client_id ? Number(form.client_id) : null,
      featured: form.featured,
    }

    try {
      if (editingId) {
        await api.put(`/admin/transformations/${editingId}`, payload)
        setNotice({ tone: 'success', message: 'Transformation updated successfully.' })
      } else {
        await api.post('/admin/transformations', payload)
        setNotice({ tone: 'success', message: 'Transformation created successfully.' })
      }

      setEditingId(null)
      setForm(emptyTransformationForm)
      await loadResources()
      await refreshSiteData()
    } catch (error) {
      setNotice({ tone: 'error', message: getApiError(error) })
    }
  }

  return (
    <AdminResourceLayout
      title="Transformation Management"
      description="Show before-and-after results with client stories and progress details."
      loading={loading}
    >
      <AdminCard title="Transformation post">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <InlineField label="Title">
            <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
          </InlineField>
          <InlineField label="Client">
            <select value={form.client_id} onChange={(event) => setForm((prev) => ({ ...prev, client_id: event.target.value }))}>
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </InlineField>
          <InlineField label="Duration">
            <input value={form.duration} onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))} />
          </InlineField>
          <InlineField label="Weight change">
            <input value={form.weight_change} onChange={(event) => setForm((prev) => ({ ...prev, weight_change: event.target.value }))} />
          </InlineField>
          <InlineField label="Goals achieved" full>
            <input value={form.goals_achieved} onChange={(event) => setForm((prev) => ({ ...prev, goals_achieved: event.target.value }))} />
          </InlineField>
          <InlineField label="Before image URL" full>
            <input value={form.before_image_url} onChange={(event) => setForm((prev) => ({ ...prev, before_image_url: event.target.value }))} />
          </InlineField>
          <InlineField label="After image URL" full>
            <input value={form.after_image_url} onChange={(event) => setForm((prev) => ({ ...prev, after_image_url: event.target.value }))} />
          </InlineField>
          <InlineField label="Result description" full>
            <textarea value={form.result_description} rows={4} onChange={(event) => setForm((prev) => ({ ...prev, result_description: event.target.value }))} />
          </InlineField>
          <InlineField label="Success story" full>
            <textarea value={form.success_story} rows={4} onChange={(event) => setForm((prev) => ({ ...prev, success_story: event.target.value }))} />
          </InlineField>
          <InlineField label="Status">
            <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as TransformationFormState['status'] }))}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </InlineField>
          <label className="checkbox-field">
            <input type="checkbox" checked={form.featured} onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))} />
            <span>Feature on the website</span>
          </label>
          {notice && <div className={`inline-alert ${notice.tone}`}>{notice.message}</div>}
          <div className="hero-actions">
            <button className="button button-primary" type="submit">
              {editingId ? 'Update transformation' : 'Create transformation'}
            </button>
            <button className="button button-ghost" type="button" onClick={() => { setEditingId(null); setForm(emptyTransformationForm) }}>
              Reset form
            </button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title="Transformation stories">
        <DataTable
          headers={['Title', 'Client', 'Duration', 'Status', 'Actions']}
          rows={transformations.map((item) => [
            item.title,
            item.client?.name ?? 'Not linked',
            item.duration,
            <StatusBadge key={`${item.id}-status`} tone={item.status === 'published' ? 'success' : 'muted'} label={item.status} />,
            <div key={`${item.id}-actions`} className="table-actions">
              <button
                className="button button-ghost"
                type="button"
                onClick={() => {
                  setEditingId(item.id)
                  setForm({
                    title: item.title,
                    client_id: item.client_id ? String(item.client_id) : '',
                    before_image_url: item.before_image_url ?? '',
                    after_image_url: item.after_image_url ?? '',
                    duration: item.duration,
                    weight_change: item.weight_change ?? '',
                    goals_achieved: item.goals_achieved ?? '',
                    result_description: item.result_description,
                    success_story: item.success_story ?? '',
                    status: item.status,
                    featured: item.featured,
                  })
                }}
              >
                Edit
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={async () => {
                  await api.delete(`/admin/transformations/${item.id}`)
                  await loadResources()
                  await refreshSiteData()
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
