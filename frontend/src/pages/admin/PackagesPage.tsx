import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { api, fromLineSeparated, getApiError, money, toLineSeparated } from '../../api'
import { useSiteData } from '../../site-data'
import type { TrainingPackage } from '../../types'
import { AdminCard, AdminResourceLayout, DataTable, InlineField, StatusBadge } from './shared'

type PackageFormState = {
  name: string
  slug: string
  description: string
  duration: string
  sessions: string
  price: string
  featuresText: string
  benefitsText: string
  suitable_for: string
  training_type: string
  whatsapp_message: string
  image_url: string
  status: 'active' | 'inactive'
  sort_order: string
}

const emptyPackageForm: PackageFormState = {
  name: '',
  slug: '',
  description: '',
  duration: '',
  sessions: '',
  price: '',
  featuresText: '',
  benefitsText: '',
  suitable_for: '',
  training_type: '',
  whatsapp_message: '',
  image_url: '',
  status: 'active',
  sort_order: '0',
}

export function AdminPackagesPage() {
  const { refresh: refreshSiteData } = useSiteData()
  const [packages, setPackages] = useState<TrainingPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<PackageFormState>(emptyPackageForm)
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const deferredSearch = useDeferredValue(search)

  async function loadPackages() {
    setLoading(true)
    try {
      const response = await api.get<{ data: TrainingPackage[] }>('/admin/packages')
      setPackages(response.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPackages()
  }, [])

  const filteredPackages = useMemo(() => {
    const keyword = deferredSearch.trim().toLowerCase()

    if (!keyword) {
      return packages
    }

    return packages.filter((item) =>
      `${item.name} ${item.training_type ?? ''} ${item.description}`.toLowerCase().includes(keyword),
    )
  }, [deferredSearch, packages])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const payload = {
      name: form.name,
      slug: form.slug || form.name,
      description: form.description,
      duration: form.duration,
      sessions: form.sessions ? Number(form.sessions) : null,
      price: Number(form.price),
      features: fromLineSeparated(form.featuresText),
      benefits: fromLineSeparated(form.benefitsText),
      suitable_for: form.suitable_for,
      training_type: form.training_type,
      whatsapp_message: form.whatsapp_message,
      image_url: form.image_url,
      status: form.status,
      sort_order: Number(form.sort_order || 0),
    }

    try {
      if (editingId) {
        await api.put(`/admin/packages/${editingId}`, payload)
        setNotice({ tone: 'success', message: 'Package updated successfully.' })
      } else {
        await api.post('/admin/packages', payload)
        setNotice({ tone: 'success', message: 'Package created successfully.' })
      }

      setEditingId(null)
      setForm(emptyPackageForm)
      await loadPackages()
      await refreshSiteData()
    } catch (error) {
      setNotice({ tone: 'error', message: getApiError(error) })
    }
  }

  return (
    <AdminResourceLayout
      title="Package Management"
      description="Add, update, and remove the packages displayed on the public website."
      loading={loading}
    >
      <AdminCard title="Create or edit package">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <InlineField label="Package name">
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </InlineField>
          <InlineField label="Slug">
            <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} />
          </InlineField>
          <InlineField label="Duration">
            <input value={form.duration} onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))} />
          </InlineField>
          <InlineField label="Sessions">
            <input value={form.sessions} onChange={(event) => setForm((prev) => ({ ...prev, sessions: event.target.value }))} />
          </InlineField>
          <InlineField label="Price">
            <input value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} />
          </InlineField>
          <InlineField label="Training type">
            <input value={form.training_type} onChange={(event) => setForm((prev) => ({ ...prev, training_type: event.target.value }))} />
          </InlineField>
          <InlineField label="Suitable for">
            <input value={form.suitable_for} onChange={(event) => setForm((prev) => ({ ...prev, suitable_for: event.target.value }))} />
          </InlineField>
          <InlineField label="Image URL">
            <input value={form.image_url} onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))} />
          </InlineField>
          <InlineField label="Status">
            <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as PackageFormState['status'] }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </InlineField>
          <InlineField label="Sort order">
            <input value={form.sort_order} onChange={(event) => setForm((prev) => ({ ...prev, sort_order: event.target.value }))} />
          </InlineField>
          <InlineField label="WhatsApp message" full>
            <input
              value={form.whatsapp_message}
              onChange={(event) => setForm((prev) => ({ ...prev, whatsapp_message: event.target.value }))}
            />
          </InlineField>
          <InlineField label="Description" full>
            <textarea value={form.description} rows={4} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          </InlineField>
          <InlineField label="Features (one per line)" full>
            <textarea value={form.featuresText} rows={4} onChange={(event) => setForm((prev) => ({ ...prev, featuresText: event.target.value }))} />
          </InlineField>
          <InlineField label="Benefits (one per line)" full>
            <textarea value={form.benefitsText} rows={4} onChange={(event) => setForm((prev) => ({ ...prev, benefitsText: event.target.value }))} />
          </InlineField>
          {notice && <div className={`inline-alert ${notice.tone}`}>{notice.message}</div>}
          <div className="hero-actions">
            <button className="button button-primary" type="submit">
              {editingId ? 'Update package' : 'Create package'}
            </button>
            <button className="button button-ghost" type="button" onClick={() => { setEditingId(null); setForm(emptyPackageForm) }}>
              Reset form
            </button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title="Existing packages">
        <div className="toolbar">
          <input
            className="toolbar-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search packages"
          />
        </div>
        <DataTable
          headers={['Package', 'Price', 'Duration', 'Status', 'Actions']}
          rows={filteredPackages.map((item) => [
            item.name,
            money(item.price),
            item.duration,
            <StatusBadge key={`${item.id}-status`} tone={item.status === 'active' ? 'success' : 'muted'} label={item.status} />,
            <div key={`${item.id}-actions`} className="table-actions">
              <button
                className="button button-ghost"
                type="button"
                onClick={() => {
                  setEditingId(item.id)
                  setForm({
                    name: item.name,
                    slug: item.slug,
                    description: item.description,
                    duration: item.duration,
                    sessions: item.sessions ? String(item.sessions) : '',
                    price: String(item.price),
                    featuresText: toLineSeparated(item.features),
                    benefitsText: toLineSeparated(item.benefits),
                    suitable_for: item.suitable_for ?? '',
                    training_type: item.training_type ?? '',
                    whatsapp_message: item.whatsapp_message ?? '',
                    image_url: item.image_url ?? '',
                    status: item.status,
                    sort_order: String(item.sort_order ?? 0),
                  })
                }}
              >
                Edit
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={async () => {
                  await api.delete(`/admin/packages/${item.id}`)
                  await loadPackages()
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
