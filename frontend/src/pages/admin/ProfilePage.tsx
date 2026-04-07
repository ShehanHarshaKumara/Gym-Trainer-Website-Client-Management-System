import { useEffect, useState } from 'react'
import { api, fromLineSeparated, getApiError, toLineSeparated } from '../../api'
import { useSiteData } from '../../site-data'
import type { TrainerProfile } from '../../types'
import { AdminCard, AdminResourceLayout, InlineField } from './shared'

type ProfileFormState = {
  full_name: string
  title: string
  headline: string
  bio: string
  experience: string
  mission: string
  phone: string
  whatsapp_number: string
  email: string
  address: string
  map_embed_url: string
  profile_image_url: string
  certificationsText: string
  skillsText: string
  instagram: string
  facebook: string
  youtube: string
}

const emptyProfileForm: ProfileFormState = {
  full_name: '',
  title: '',
  headline: '',
  bio: '',
  experience: '',
  mission: '',
  phone: '',
  whatsapp_number: '',
  email: '',
  address: '',
  map_embed_url: '',
  profile_image_url: '',
  certificationsText: '',
  skillsText: '',
  instagram: '',
  facebook: '',
  youtube: '',
}

export function AdminProfilePage() {
  const { refresh: refreshSiteData } = useSiteData()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<ProfileFormState>(emptyProfileForm)
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadProfile() {
      try {
        const response = await api.get<{ data: TrainerProfile | null }>('/admin/trainer-profile')
        const profile = response.data.data

        if (!ignore && profile) {
          setForm({
            full_name: profile.full_name,
            title: profile.title,
            headline: profile.headline ?? '',
            bio: profile.bio,
            experience: profile.experience,
            mission: profile.mission ?? '',
            phone: profile.phone ?? '',
            whatsapp_number: profile.whatsapp_number ?? '',
            email: profile.email ?? '',
            address: profile.address ?? '',
            map_embed_url: profile.map_embed_url ?? '',
            profile_image_url: profile.profile_image_url ?? '',
            certificationsText: toLineSeparated(profile.certifications),
            skillsText: toLineSeparated(profile.skills),
            instagram: profile.social_links.instagram ?? '',
            facebook: profile.social_links.facebook ?? '',
            youtube: profile.social_links.youtube ?? '',
          })
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      ignore = true
    }
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      await api.put('/admin/trainer-profile', {
        full_name: form.full_name,
        title: form.title,
        headline: form.headline,
        bio: form.bio,
        experience: form.experience,
        mission: form.mission,
        phone: form.phone,
        whatsapp_number: form.whatsapp_number,
        email: form.email,
        address: form.address,
        map_embed_url: form.map_embed_url,
        profile_image_url: form.profile_image_url,
        certifications: fromLineSeparated(form.certificationsText),
        skills: fromLineSeparated(form.skillsText),
        social_links: {
          instagram: form.instagram,
          facebook: form.facebook,
          youtube: form.youtube,
        },
      })

      setNotice({ tone: 'success', message: 'Trainer profile updated successfully.' })
      await refreshSiteData()
    } catch (error) {
      setNotice({ tone: 'error', message: getApiError(error) })
    }
  }

  return (
    <AdminResourceLayout
      title="Trainer Profile"
      description="Control the biography, certifications, contact details, and social links used across the website."
      loading={loading}
    >
      <AdminCard title="Public profile content">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <InlineField label="Full name">
            <input value={form.full_name} onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))} />
          </InlineField>
          <InlineField label="Title">
            <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
          </InlineField>
          <InlineField label="Experience">
            <input value={form.experience} onChange={(event) => setForm((prev) => ({ ...prev, experience: event.target.value }))} />
          </InlineField>
          <InlineField label="Profile image URL">
            <input value={form.profile_image_url} onChange={(event) => setForm((prev) => ({ ...prev, profile_image_url: event.target.value }))} />
          </InlineField>
          <InlineField label="Headline" full>
            <input value={form.headline} onChange={(event) => setForm((prev) => ({ ...prev, headline: event.target.value }))} />
          </InlineField>
          <InlineField label="Bio" full>
            <textarea value={form.bio} rows={5} onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))} />
          </InlineField>
          <InlineField label="Mission" full>
            <textarea value={form.mission} rows={4} onChange={(event) => setForm((prev) => ({ ...prev, mission: event.target.value }))} />
          </InlineField>
          <InlineField label="Phone">
            <input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
          </InlineField>
          <InlineField label="WhatsApp number">
            <input value={form.whatsapp_number} onChange={(event) => setForm((prev) => ({ ...prev, whatsapp_number: event.target.value }))} />
          </InlineField>
          <InlineField label="Email">
            <input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
          </InlineField>
          <InlineField label="Map embed URL">
            <input value={form.map_embed_url} onChange={(event) => setForm((prev) => ({ ...prev, map_embed_url: event.target.value }))} />
          </InlineField>
          <InlineField label="Address" full>
            <textarea value={form.address} rows={3} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} />
          </InlineField>
          <InlineField label="Certifications (one per line)" full>
            <textarea value={form.certificationsText} rows={4} onChange={(event) => setForm((prev) => ({ ...prev, certificationsText: event.target.value }))} />
          </InlineField>
          <InlineField label="Skills (one per line)" full>
            <textarea value={form.skillsText} rows={4} onChange={(event) => setForm((prev) => ({ ...prev, skillsText: event.target.value }))} />
          </InlineField>
          <InlineField label="Instagram">
            <input value={form.instagram} onChange={(event) => setForm((prev) => ({ ...prev, instagram: event.target.value }))} />
          </InlineField>
          <InlineField label="Facebook">
            <input value={form.facebook} onChange={(event) => setForm((prev) => ({ ...prev, facebook: event.target.value }))} />
          </InlineField>
          <InlineField label="YouTube">
            <input value={form.youtube} onChange={(event) => setForm((prev) => ({ ...prev, youtube: event.target.value }))} />
          </InlineField>
          {notice && <div className={`inline-alert ${notice.tone}`}>{notice.message}</div>}
          <div className="hero-actions">
            <button className="button button-primary" type="submit">
              Save profile
            </button>
          </div>
        </form>
      </AdminCard>
    </AdminResourceLayout>
  )
}
