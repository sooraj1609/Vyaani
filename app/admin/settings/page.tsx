'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import styles from '../products/products.module.css'

export default function AdminSettings() {
  const [comingSoon, setComingSoon] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('coming_soon_mode')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setComingSoon(data.coming_soon_mode)
        setLoading(false)
      })
  }, [])

  const toggle = async () => {
    setSaving(true)
    const newValue = !comingSoon
    const { error } = await supabase
      .from('site_settings')
      .update({ coming_soon_mode: newValue })
      .eq('id', 1)

    if (!error) setComingSoon(newValue)
    setSaving(false)
  }

  if (loading) return <div className={styles.wrapper}>Loading...</div>

  return (
    <div className={styles.wrapper}>
      <h1>Site Settings</h1>

      <div style={{ background: 'white', border: '1px solid #E8DFD3', padding: 24, maxWidth: 500 }}>
        <h2 style={{ fontSize: 16, color: '#7A1C2B', marginBottom: 10 }}>Coming Soon Mode</h2>
        <p style={{ fontSize: 13, color: '#6B5D52', fontFamily: 'Arial, sans-serif', marginBottom: 16 }}>
          When enabled, visitors see the "Coming Soon" page instead of the storefront.
          Admin access stays available so you can continue working.
        </p>
        <button
          onClick={toggle}
          disabled={saving}
          style={{
            padding: '12px 24px',
            background: comingSoon ? '#B02A2A' : '#2E7D32',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            textTransform: 'uppercase',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {saving ? 'Saving...' : comingSoon ? 'Turn OFF (go live)' : 'Turn ON (show Coming Soon)'}
        </button>
      </div>
    </div>
  )
}