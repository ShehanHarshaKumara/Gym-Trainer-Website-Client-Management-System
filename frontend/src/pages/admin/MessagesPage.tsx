import { useEffect, useState } from 'react'
import { api, getApiError } from '../../api'
import type { ContactMessageRecord } from '../../types'
import { AdminCard, AdminResourceLayout, DataTable, InlineField, StatusBadge } from './shared'

type MessageFormState = {
  name: string
  phone: string
  email: string
  message: string
  status: 'new' | 'read' | 'archived'
}

const emptyMessageForm: MessageFormState = {
  name: '',
  phone: '',
  email: '',
  message: '',
  status: 'new',
}

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<MessageFormState>(emptyMessageForm)
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  async function loadMessages() {
    setLoading(true)
    try {
      const response = await api.get<{ data: ContactMessageRecord[] }>('/admin/contact-messages')
      setMessages(response.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMessages()
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      if (editingId) {
        await api.put(`/admin/contact-messages/${editingId}`, form)
        setNotice({ tone: 'success', message: 'Message updated successfully.' })
      } else {
        await api.post('/admin/contact-messages', form)
        setNotice({ tone: 'success', message: 'Message created successfully.' })
      }

      setEditingId(null)
      setForm(emptyMessageForm)
      await loadMessages()
    } catch (error) {
      setNotice({ tone: 'error', message: getApiError(error) })
    }
  }

  return (
    <AdminResourceLayout
      title="Inquiry Management"
      description="Review website messages, mark them read, and keep the inbox organized."
      loading={loading}
    >
      <AdminCard title="Message editor">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <InlineField label="Name">
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </InlineField>
          <InlineField label="Phone">
            <input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
          </InlineField>
          <InlineField label="Email">
            <input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
          </InlineField>
          <InlineField label="Status">
            <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as MessageFormState['status'] }))}>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </InlineField>
          <InlineField label="Message" full>
            <textarea value={form.message} rows={4} onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))} />
          </InlineField>
          {notice && <div className={`inline-alert ${notice.tone}`}>{notice.message}</div>}
          <div className="hero-actions">
            <button className="button button-primary" type="submit">
              {editingId ? 'Update message' : 'Create message'}
            </button>
            <button className="button button-ghost" type="button" onClick={() => { setEditingId(null); setForm(emptyMessageForm) }}>
              Reset form
            </button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title="Inbox">
        <DataTable
          headers={['Name', 'Email', 'Status', 'Message', 'Actions']}
          rows={messages.map((item) => [
            item.name,
            item.email ?? 'No email',
            <StatusBadge key={`${item.id}-status`} tone={item.status === 'new' ? 'warning' : item.status === 'read' ? 'success' : 'muted'} label={item.status} />,
            item.message,
            <div key={`${item.id}-actions`} className="table-actions">
              <button
                className="button button-ghost"
                type="button"
                onClick={() => {
                  setEditingId(item.id)
                  setForm({
                    name: item.name,
                    phone: item.phone ?? '',
                    email: item.email ?? '',
                    message: item.message,
                    status: item.status,
                  })
                }}
              >
                Edit
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={async () => {
                  await api.delete(`/admin/contact-messages/${item.id}`)
                  await loadMessages()
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
