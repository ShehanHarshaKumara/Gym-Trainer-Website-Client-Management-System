import { motion } from 'framer-motion'
import {
  Award,
  Clock3,
  Dumbbell,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Quote,
  Sparkles,
  Star,
  Target,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { api, getApiError, money } from '../api'
import { useSiteData } from '../site-data'
import type { FeedbackRecord, TrainingPackage, TransformationRecord } from '../types'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/packages', label: 'Packages' },
  { to: '/transformations', label: 'Results' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/contact', label: 'Contact' },
]

export function PublicLayout() {
  const location = useLocation()
  const { site, error } = useSiteData()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const trainer = site?.trainer_profile

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-row">
          <Link to="/" className="brand-mark">
            <span>Iron Pulse</span>
            <small>Elite Coaching</small>
          </Link>

          <nav className="desktop-nav">
            {publicLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/admin/login" className="button button-ghost">
              Admin
            </Link>
          </nav>

          <button
            className="icon-button mobile-nav-toggle"
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav">
            {publicLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/admin/login" className="button button-ghost" onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
          </div>
        )}
      </header>

      {error && (
        <div className="container">
          <div className="inline-alert error">{error}</div>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>Iron Pulse Fit</h3>
            <p>
              Personal training built around real results, practical coaching, and consistent
              support.
            </p>
          </div>
          <div>
            <h4>Reach Out</h4>
            <p>{trainer?.phone ?? 'Phone available in the contact section.'}</p>
            <p>{trainer?.email ?? 'coach@ironpulsefit.com'}</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <div className="footer-links">
              {publicLinks.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {trainer?.whatsapp_url && (
        <a className="whatsapp-float" href={trainer.whatsapp_url} target="_blank" rel="noreferrer">
          <MessageCircle size={20} />
          <span>Chat on WhatsApp</span>
        </a>
      )}
    </div>
  )
}

export function HomePage() {
  const { site, loading } = useSiteData()

  if (loading || !site) {
    return <PageLoader label="Loading gym trainer website..." />
  }

  const trainer = site.trainer_profile
  const featuredPackages = site.packages.slice(0, 3)
  const featuredTransformations = site.transformations.slice(0, 2)
  const featuredFeedback = site.feedback.slice(0, 3)

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow">
              <Sparkles size={16} />
              Result-focused personal coaching
            </span>
            <h1>Transform your body with structured training and direct coach support.</h1>
            <p>
              {trainer?.headline ??
                'Custom fat-loss, strength, and online coaching plans designed for consistency and visible progress.'}
            </p>
            <div className="hero-actions">
              <Link to="/packages" className="button button-primary">
                Explore Packages
              </Link>
              <Link to="/contact" className="button button-secondary">
                Book a Consultation
              </Link>
            </div>
            <div className="stats-strip">
              <StatChip icon={<Dumbbell size={16} />} label="Programs" value={site.stats.packages} />
              <StatChip icon={<Users size={16} />} label="Clients" value={site.stats.clients} />
              <StatChip
                icon={<Target size={16} />}
                label="Results Shared"
                value={site.stats.transformations}
              />
            </div>
          </motion.div>

          <motion.div
            className="hero-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img
              src={
                trainer?.profile_image_url ??
                'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80'
              }
              alt={trainer?.full_name ?? 'Personal trainer'}
            />
            <div className="hero-card-body">
              <strong>{trainer?.full_name ?? 'Iron Pulse Coach'}</strong>
              <span>{trainer?.title ?? 'Certified Personal Trainer'}</span>
              <p>{trainer?.experience}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionTitle
        eyebrow="Popular plans"
        title="Packages built for fat loss, strength, and flexible online coaching."
        description="Every plan includes direct support, measurable progress, and a WhatsApp-first communication flow."
      />
      <section className="container card-grid three-up">
        {featuredPackages.map((pkg) => (
          <PackageCard key={pkg.id} packageItem={pkg} />
        ))}
      </section>

      <SectionTitle
        eyebrow="Visible change"
        title="Real transformation stories that build trust before the first session."
        description="Use the transformation gallery to show momentum, lifestyle change, and long-term sustainability."
      />
      <section className="container card-grid two-up">
        {featuredTransformations.map((item) => (
          <TransformationCard key={item.id} transformation={item} />
        ))}
      </section>

      <SectionTitle
        eyebrow="Client voice"
        title="Feedback that highlights support, consistency, and sustainable results."
        description="Approved testimonials are displayed publicly, while new submissions stay pending until reviewed."
      />
      <section className="container card-grid three-up">
        {featuredFeedback.map((item) => (
          <FeedbackCard key={item.id} feedback={item} />
        ))}
      </section>

      <section className="cta-band">
        <div className="container cta-band-inner">
          <div>
            <h2>Start with the right plan and a coach who actually stays involved.</h2>
            <p>
              Build muscle, lose fat, or get back on track with a structure that fits your real
              schedule.
            </p>
          </div>
          <div className="hero-actions">
            <Link to="/packages" className="button button-primary">
              View Programs
            </Link>
            {trainer?.whatsapp_url && (
              <a className="button button-secondary" href={trainer.whatsapp_url} target="_blank" rel="noreferrer">
                Message on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export function AboutPage() {
  const { site, loading } = useSiteData()

  if (loading || !site) {
    return <PageLoader label="Loading trainer profile..." />
  }

  const trainer = site.trainer_profile

  if (!trainer) {
    return <EmptyState title="Trainer profile unavailable" body="Please seed or update the trainer profile from the admin panel." />
  }

  return (
    <section className="page-section">
      <div className="container about-grid">
        <motion.img
          className="about-image"
          src={trainer.profile_image_url ?? 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=1000&q=80'}
          alt={trainer.full_name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        />
        <motion.div className="content-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow">
            <Award size={16} />
            Meet your trainer
          </span>
          <h1>{trainer.full_name}</h1>
          <h2>{trainer.title}</h2>
          <p>{trainer.bio}</p>
          <div className="detail-stack">
            <div className="detail-item">
              <Clock3 size={18} />
              <span>{trainer.experience}</span>
            </div>
            <div className="detail-item">
              <MapPin size={18} />
              <span>{trainer.address}</span>
            </div>
          </div>
          <p>{trainer.mission}</p>
        </motion.div>
      </div>

      <div className="container info-panels">
        <InfoListCard title="Specialties" icon={<Target size={18} />} items={trainer.skills} />
        <InfoListCard title="Certifications" icon={<Award size={18} />} items={trainer.certifications} />
      </div>
    </section>
  )
}

export function PackagesPage() {
  const { site, loading } = useSiteData()

  if (loading || !site) {
    return <PageLoader label="Loading packages..." />
  }

  return (
    <section className="page-section">
      <SectionTitle
        eyebrow="Programs"
        title="Choose the package that matches your current goal and schedule."
        description="Every package includes direct communication, structured sessions, and a ready-made WhatsApp inquiry flow."
      />
      <div className="container card-grid three-up">
        {site.packages.map((pkg) => (
          <PackageCard key={pkg.id} packageItem={pkg} large />
        ))}
      </div>
    </section>
  )
}

export function TransformationsPage() {
  const { site, loading } = useSiteData()

  if (loading || !site) {
    return <PageLoader label="Loading transformations..." />
  }

  return (
    <section className="page-section">
      <SectionTitle
        eyebrow="Before and after"
        title="Transformation results that show structure, support, and consistency."
        description="Use these stories to build trust and help visitors imagine their own next chapter."
      />
      <div className="container card-grid two-up">
        {site.transformations.map((item) => (
          <TransformationCard key={item.id} transformation={item} expanded />
        ))}
      </div>
    </section>
  )
}

type FeedbackFormValues = {
  client_name: string
  rating: number
  message: string
  photo: FileList
}

export function FeedbackPage() {
  const { site, loading } = useSiteData()
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    defaultValues: {
      rating: 5,
    },
  })

  if (loading || !site) {
    return <PageLoader label="Loading feedback..." />
  }

  async function onSubmit(values: FeedbackFormValues) {
    const formData = new FormData()
    formData.append('client_name', values.client_name)
    formData.append('rating', String(values.rating))
    formData.append('message', values.message)

    const file = values.photo?.[0]

    if (file) {
      formData.append('photo', file)
    }

    try {
      await api.post('/feedback', formData)
      setNotice({
        tone: 'success',
        message: 'Thanks. Your review was submitted and will show after admin approval.',
      })
      reset({ client_name: '', rating: 5, message: '' })
    } catch (error) {
      setNotice({ tone: 'error', message: getApiError(error) })
    }
  }

  return (
    <section className="page-section">
      <SectionTitle
        eyebrow="Testimonials"
        title="Client reviews that show how the coaching experience actually feels."
        description="Public reviews are approved by the admin panel before they appear on the website."
      />
      <div className="container review-layout">
        <div className="card-grid two-up">
          {site.feedback.map((item) => (
            <FeedbackCard key={item.id} feedback={item} />
          ))}
        </div>

        <motion.form className="content-card form-card" onSubmit={handleSubmit(onSubmit)} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <h3>Leave your feedback</h3>
          <FormField label="Your name" error={errors.client_name?.message}>
            <input {...register('client_name', { required: 'Name is required.' })} placeholder="Your full name" />
          </FormField>
          <FormField label="Rating" error={errors.rating?.message}>
            <select {...register('rating', { valueAsNumber: true })}>
              {[5, 4, 3, 2, 1].map((score) => (
                <option key={score} value={score}>
                  {score} stars
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Message" error={errors.message?.message}>
            <textarea
              {...register('message', { required: 'Please share your experience.' })}
              rows={5}
              placeholder="How was your training journey?"
            />
          </FormField>
          <FormField label="Optional photo">
            <input type="file" accept="image/*" {...register('photo')} />
          </FormField>
          {notice && <div className={`inline-alert ${notice.tone}`}>{notice.message}</div>}
          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </motion.form>
      </div>
    </section>
  )
}

type ContactFormValues = {
  name: string
  phone: string
  email: string
  message: string
}

export function ContactPage() {
  const { site, loading } = useSiteData()
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>()

  if (loading || !site) {
    return <PageLoader label="Loading contact details..." />
  }

  const trainer = site.trainer_profile

  async function onSubmit(values: ContactFormValues) {
    try {
      await api.post('/contact-messages', values)
      setNotice({ tone: 'success', message: 'Your message was sent successfully.' })
      reset()
    } catch (error) {
      setNotice({ tone: 'error', message: getApiError(error) })
    }
  }

  return (
    <section className="page-section">
      <SectionTitle
        eyebrow="Contact"
        title="Reach out for package details, coaching advice, or your first consultation."
        description="Visitors can use the form, WhatsApp, or direct contact details managed from the admin panel."
      />
      <div className="container contact-grid">
        <div className="content-card">
          <h3>Contact details</h3>
          <div className="detail-stack">
            <div className="detail-item">
              <Phone size={18} />
              <span>{trainer?.phone ?? 'Not set yet'}</span>
            </div>
            <div className="detail-item">
              <MessageCircle size={18} />
              <span>{trainer?.whatsapp_number ?? 'Not set yet'}</span>
            </div>
            <div className="detail-item">
              <Mail size={18} />
              <span>{trainer?.email ?? 'Not set yet'}</span>
            </div>
            <div className="detail-item">
              <MapPin size={18} />
              <span>{trainer?.address ?? 'Not set yet'}</span>
            </div>
          </div>
          <div className="social-list">
            {Object.entries(trainer?.social_links ?? {}).map(([name, value]) => (
              <a key={name} href={value} target="_blank" rel="noreferrer">
                {name}
              </a>
            ))}
          </div>
          {trainer?.map_embed_url && (
            <div className="map-frame">
              <iframe src={trainer.map_embed_url} title="Trainer location map" loading="lazy" />
            </div>
          )}
        </div>

        <motion.form className="content-card form-card" onSubmit={handleSubmit(onSubmit)} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <h3>Send an inquiry</h3>
          <FormField label="Full name" error={errors.name?.message}>
            <input {...register('name', { required: 'Name is required.' })} placeholder="Your name" />
          </FormField>
          <FormField label="Phone number" error={errors.phone?.message}>
            <input {...register('phone')} placeholder="+94 77 123 4567" />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <input type="email" {...register('email')} placeholder="you@example.com" />
          </FormField>
          <FormField label="Message" error={errors.message?.message}>
            <textarea
              {...register('message', { required: 'Please include a message.' })}
              rows={6}
              placeholder="Tell us what you want to achieve."
            />
          </FormField>
          {notice && <div className={`inline-alert ${notice.tone}`}>{notice.message}</div>}
          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </section>
  )
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <motion.div
      className="container section-heading"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </motion.div>
  )
}

function PackageCard({ packageItem, large = false }: { packageItem: TrainingPackage; large?: boolean }) {
  return (
    <motion.article
      className={`content-card package-card${large ? ' large' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <img
        className="card-cover"
        src={
          packageItem.image_url ??
          'https://images.unsplash.com/photo-1571019613914-85f342c55f55?auto=format&fit=crop&w=900&q=80'
        }
        alt={packageItem.name}
      />
      <div className="card-body">
        <div className="package-meta">
          <span>{packageItem.training_type ?? 'Coaching plan'}</span>
          <strong>{money(packageItem.price)}</strong>
        </div>
        <h3>{packageItem.name}</h3>
        <p>{packageItem.description}</p>
        <ul className="pill-list">
          {packageItem.features.slice(0, large ? 6 : 4).map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <div className="package-footer">
          <span>{packageItem.duration}</span>
          {packageItem.sessions ? <span>{packageItem.sessions} sessions</span> : null}
        </div>
        <div className="hero-actions">
          {packageItem.whatsapp_url ? (
            <a className="button button-primary" href={packageItem.whatsapp_url} target="_blank" rel="noreferrer">
              Book on WhatsApp
            </a>
          ) : (
            <Link className="button button-primary" to="/contact">
              Contact Coach
            </Link>
          )}
          <Link className="button button-ghost" to="/contact">
            Ask Questions
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

function TransformationCard({
  transformation,
  expanded = false,
}: {
  transformation: TransformationRecord
  expanded?: boolean
}) {
  return (
    <motion.article
      className={`content-card transformation-card${expanded ? ' expanded' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="before-after-grid">
        <img
          src={
            transformation.before_image_url ??
            'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80'
          }
          alt={`${transformation.title} before`}
        />
        <img
          src={
            transformation.after_image_url ??
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80'
          }
          alt={`${transformation.title} after`}
        />
      </div>
      <div className="card-body">
        <div className="package-meta">
          <span>{transformation.client?.name ?? 'Client story'}</span>
          <strong>{transformation.duration}</strong>
        </div>
        <h3>{transformation.title}</h3>
        <p>{transformation.result_description}</p>
        <ul className="detail-list">
          {transformation.weight_change ? <li>Weight change: {transformation.weight_change}</li> : null}
          {transformation.goals_achieved ? <li>Goals: {transformation.goals_achieved}</li> : null}
        </ul>
        {transformation.success_story ? <blockquote>{transformation.success_story}</blockquote> : null}
      </div>
    </motion.article>
  )
}

function FeedbackCard({ feedback }: { feedback: FeedbackRecord }) {
  return (
    <motion.article
      className="content-card feedback-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <Quote className="quote-icon" size={24} />
      <div className="rating-row">
        {Array.from({ length: feedback.rating }).map((_, index) => (
          <Star key={`${feedback.id}-${index}`} size={16} fill="currentColor" />
        ))}
      </div>
      <p>{feedback.message}</p>
      <strong>{feedback.client_name}</strong>
    </motion.article>
  )
}

function InfoListCard({
  title,
  icon,
  items,
}: {
  title: string
  icon: ReactNode
  items: string[]
}) {
  return (
    <div className="content-card">
      <div className="card-title">
        {icon}
        <h3>{title}</h3>
      </div>
      <ul className="pill-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function FormField({
  label,
  children,
  error,
}: {
  label: string
  children: React.ReactNode
  error?: string
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {error ? <small className="field-error">{error}</small> : null}
    </label>
  )
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: number
}) {
  return (
    <div className="stat-chip">
      {icon}
      <div>
        <strong>{value}+</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

function PageLoader({ label }: { label: string }) {
  return (
    <section className="page-section">
      <div className="container">
        <div className="content-card centered">{label}</div>
      </div>
    </section>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <section className="page-section">
      <div className="container">
        <div className="content-card centered">
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
      </div>
    </section>
  )
}
