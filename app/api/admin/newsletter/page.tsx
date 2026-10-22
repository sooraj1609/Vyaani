'use client'

import { useEffect, useState } from 'react'
import styles from 'app/admin/products/products.module.css'

type Subscriber = { id: string; email: string; created_at: string }

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/newsletter')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) setError(data.error || 'Failed to load subscribers')
        else setSubscribers(data.subscribers)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load subscribers')
        setLoading(false)
      })
  }, [])

  const downloadCsv = () => {
    const rows = subscribers.map(
      (s) => `"${s.email}",${new Date(s.created_at).toISOString().slice(0, 10)}`
    )
    const csv = 'email,subscribed_on\n' + rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vyaani-subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className={styles.wrapper}>Loading...</div>

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Newsletter Subscribers ({subscribers.length})</h1>
        {subscribers.length > 0 && (
          <button onClick={downloadCsv} className={styles.addBtn} style={{ border: 'none', cursor: 'pointer' }}>
            Download CSV
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Subscribed on</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s.id}>
              <td>{s.email}</td>
              <td>{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!error && subscribers.length === 0 && <p className={styles.empty}>No subscribers yet.</p>}
    </div>
  )
}