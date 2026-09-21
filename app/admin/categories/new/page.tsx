'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from '../../products/products.module.css'
import formStyles from '../../products/new/form.module.css'

export default function NewCategory() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const generateSlug = (value: string) => {
    setName(value)
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error } = await supabase.from('categories').insert({ name, slug })

    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      router.push('/admin/categories')
    }
  }

  return (
    <div className={styles.wrapper}>
      <h1>Add Category</h1>

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <label>
          Name
          <input type="text" value={name} onChange={(e) => generateSlug(e.target.value)} required />
        </label>

        <label>
          Slug
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </label>

        {error && <p className={formStyles.error}>{error}</p>}

        <button type="submit" disabled={saving} className={formStyles.submitBtn}>
          {saving ? 'Saving...' : 'Save Category'}
        </button>
      </form>
    </div>
  )
}