import { useState } from 'react'
import {
  LayoutDashboard,
  LogOut,
  Mailbox,
  MessageSquareQuote,
  Package2,
  ShieldCheck,
  Sparkles,
  Users,
  UserSquare2,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { getApiError } from '../api'
import { useAuth } from '../auth'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/packages', label: 'Packages', icon: <Package2 size={18} /> },
  { to: '/admin/clients', label: 'Clients', icon: <Users size={18} /> },
  { to: '/admin/transformations', label: 'Transformations', icon: <Sparkles size={18} /> },
  { to: '/admin/feedback', label: 'Feedback', icon: <MessageSquareQuote size={18} /> },
  { to: '/admin/messages', label: 'Messages', icon: <Mailbox size={18} /> },
  { to: '/admin/profile', label: 'Trainer Profile', icon: <UserSquare2 size={18} /> },
]

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { admin, login, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ email: string; password: string }>({
    defaultValues: {
      email: 'admin@gymtrainer.test',
      password: 'password123',
    },
  })

  if (!loading && admin) {
    return <Navigate to="/admin" replace />
  }

  return (
    <section className="admin-login-screen">
      <form
        className="admin-login-card"
        onSubmit={handleSubmit(async (values) => {
          try {
            setError(null)
            await login(values.email, values.password)
            navigate('/admin')
          } catch (loginError) {
            setError(getApiError(loginError, 'Could not sign in.'))
          }
        })}
      >
        <div className="eyebrow">
          <ShieldCheck size={16} />
          Admin access
        </div>
        <h1>Manage packages, clients, reviews, and trainer content.</h1>
        <p>Use the seeded admin account to customize the full website.</p>
        <label className="form-field">
          <span>Email</span>
          <input type="email" {...register('email', { required: true })} />
        </label>
        <label className="form-field">
          <span>Password</span>
          <input type="password" {...register('password', { required: true })} />
        </label>
        {error && <div className="inline-alert error">{error}</div>}
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </section>
  )
}

export function AdminLayout() {
  const { admin, loading, logout } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-mark">
          <span>Iron Pulse</span>
          <small>Admin Panel</small>
        </div>

        <nav className="admin-nav">
          {adminLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <strong>{admin.name}</strong>
          <small>{admin.role}</small>
          <button
            className="button button-ghost"
            type="button"
            onClick={async () => {
              await logout()
              navigate('/admin/login')
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Gym Trainer Website Admin</h1>
            <p>Control website content, packages, reviews, and communication from one place.</p>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  )
}

export { AdminDashboardPage } from './admin/DashboardPage'
export { AdminPackagesPage } from './admin/PackagesPage'
export { AdminClientsPage } from './admin/ClientsPage'
export { AdminTransformationsPage } from './admin/TransformationsPage'
export { AdminFeedbackPage } from './admin/FeedbackPage'
export { AdminMessagesPage } from './admin/MessagesPage'
export { AdminProfilePage } from './admin/ProfilePage'
