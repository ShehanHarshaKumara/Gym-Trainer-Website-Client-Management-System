import { useEffect, useState } from 'react'
import { api, getApiError, prettyDate } from '../../api'
import { useSiteData } from '../../site-data'
import type { FeedbackRecord } from '../../types'
import { AdminCard, AdminResourceLayout, DataTable, InlineField, StatusBadge } from './shared'

type FeedbackFormState = {
  client_name: string
  rating: string
  message: string
  photo_url: string
  status: 'pending' | 'approved' | 'rejected'
  is_featured: boolean
}

const emptyFeedbackForm: FeedbackFormState = {
  client_name: '',
  rating: '5',
  message: '',
  photo_url: '',
  status: 'approved',
  is_featured: false,
}

export function AdminFeedbackPage() {
  const { refresh: refreshSiteData } = useSiteData()
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FeedbackFormState>(emptyFeedbackForm)
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  async function loadFeedback() {
    setLoading(true)
    try {
      const response = await api.get<{ data: FeedbackRecord[] }>('/admin/feedback')
      setFeedback(response.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadFeedback()
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const payload = {
      ...form,
      rating: Number(form.rating),
      is_featured: form.is_featured,
    }

    try {
      if (editingId) {
        await api.put(`/admin/feedback/${editingId}`, payload)
        setNotice({ tone: 'success', message: 'Feedback updated successfully.' })
      } else {
        await api.post('/admin/feedback', payload)
        setNotice({ tone: 'success', message: 'Feedback created successfully.' })
      }

      setEditingId(null)
      setForm(emptyFeedbackForm)
      await loadFeedback()
      await refreshSiteData()
    } catch (error) {
      setNotice({ tone: 'error', message: getApiError(error) })
    }
  }

  return (
    <AdminResourceLayout
      title="Review Moderation"
      description="Approve, reject, feature, and curate public testimonials."
      loading={loading}
    >
      <AdminCard title="Review editor">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <InlineField label="Client name">
            <input value={form.client_name} onChange={(event) => setForm((prev) => ({ ...prev, client_name: event.target.value }))} />
          </InlineField>
          <InlineField label="Rating">
            <select value={form.rating} onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))}>
              {[5, 4, 3, 2, 1].map((score) => (
                <option key={score} value={score}>
                  {score} stars
                </option>
              ))}
            </select>
          </InlineField>
          <InlineField label="Status">
            <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as FeedbackFormState['status'] }))}>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </InlineField>
          <InlineField label="Photo URL">
            <input value={form.photo_url} onChange={(event) => setForm((prev) => ({ ...prev, photo_url: event.target.value }))} />
          </InlineField>
          <InlineField label="Message" full>
            <textarea value={form.message} rows={4} onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))} />
          </InlineField>
          <label className="checkbox-field">
            <input type="checkbox" checked={form.is_featured} onChange={(event) => setForm((prev) => ({ ...prev, is_featured: event.target.checked }))} />
            <span>Feature this review</span>
          </label>
          {notice && <div className={`inline-alert ${notice.tone}`}>{notice.message}</div>}
          <div className="hero-actions">
            <button className="button button-primary" type="submit">
              {editingId ? 'Update review' : 'Create review'}
            </button>
            <button className="button button-ghost" type="button" onClick={() => { setEditingId(null); setForm(emptyFeedbackForm) }}>
              Reset form
            </button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title="Submitted reviews">
        <DataTable
          headers={['Client', 'Rating', 'Status', 'Created', 'Actions']}
          rows={feedback.map((item) => [
            item.client_name,
            `${item.rating}/5`,
            <StatusBadge key={`${item.id}-status`} tone={item.status === 'approved' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'} label={item.status} />,
            prettyDate(item.created_at),
            <div key={`${item.id}-actions`} className="table-actions">
              <button
                className="button button-ghost"
                type="button"
                onClick={() => {
                  setEditingId(item.id)
                  setForm({
                    client_name: item.client_name,
                    rating: String(item.rating),
                    message: item.message,
                    photo_url: item.photo_url ?? '',
                    status: item.status,
                    is_featured: item.is_featured,
                  })
                }}
              >
                Edit
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={async () => {
                  await api.delete(`/admin/feedback/${item.id}`)
                  await loadFeedback()
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
