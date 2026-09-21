'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from '../products.module.css'
import formStyles from './form.module.css'

export default function NewProduct() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [materialDetails, setMaterialDetails] = useState('')
  const [careInstructions, setCareInstructions] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

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

    const { error } = await supabase.from('products').insert({
      name,
      slug,
      description,
      material_details: materialDetails,
      care_instructions: careInstructions,
      price: parseFloat(price),
      category_id: categoryId || null,
      is_active: isActive,
    })

    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      router.push('/admin/products')
    }
  }

  return (
    <div className={styles.wrapper}>
      <h1>Add Product</h1>

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => generateSlug(e.target.value)}
            required
          />
        </label>

        <label>
          Slug (auto-generated, editable)
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </label>

        <label>
          Material Details
          <input
            type="text"
            value={materialDetails}
            onChange={(e) => setMaterialDetails(e.target.value)}
            placeholder="e.g. Gold-plated brass, anti-tarnish coating"
          />
        </label>

        <label>
          Care Instructions
          <textarea
            value={careInstructions}
            onChange={(e) => setCareInstructions(e.target.value)}
            rows={2}
            placeholder="e.g. Avoid water and perfume contact. Store in a dry pouch."
          />
        </label>

        <label>
          Price (₹)
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Category
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label className={formStyles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active (visible on storefront)
        </label>

        {error && <p className={formStyles.error}>{error}</p>}

        <button type="submit" disabled={saving} className={formStyles.submitBtn}>
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  )
}