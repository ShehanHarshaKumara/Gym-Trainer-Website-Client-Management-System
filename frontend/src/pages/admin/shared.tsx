import type { PropsWithChildren, ReactNode } from 'react'

export function AdminResourceLayout({
  title,
  description,
  loading,
  children,
}: PropsWithChildren<{ title: string; description: string; loading?: boolean }>) {
  if (loading) {
    return <AdminLoader label={`Loading ${title.toLowerCase()}...`} />
  }

  return (
    <div className="admin-section-stack">
      <section className="admin-page-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </section>
      {children}
    </div>
  )
}

export function AdminCard({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  )
}

export function InlineField({
  label,
  full = false,
  children,
}: {
  label: string
  full?: boolean
  children: ReactNode
}) {
  return (
    <label className={`form-field${full ? ' full' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}

export function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatusBadge({
  tone,
  label,
}: {
  tone: 'success' | 'warning' | 'danger' | 'muted'
  label: string
}) {
  return <span className={`status-badge ${tone}`}>{label}</span>
}

export function SimpleList({
  items,
}: {
  items: Array<{ title: string; subtitle: string; meta: string }>
}) {
  return (
    <div className="simple-list">
      {items.map((item) => (
        <article key={`${item.title}-${item.meta}`} className="simple-list-item">
          <div>
            <strong>{item.title}</strong>
            <p>{item.subtitle}</p>
          </div>
          <StatusBadge tone="muted" label={item.meta} />
        </article>
      ))}
    </div>
  )
}

export function AdminLoader({ label }: { label: string }) {
  return <div className="admin-card">{label}</div>
}

export function AdminError({ message }: { message: string }) {
  return <div className="inline-alert error">{message}</div>
}
