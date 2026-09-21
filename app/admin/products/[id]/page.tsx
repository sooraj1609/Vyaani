'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from '../products.module.css'
import formStyles from '../new/form.module.css'

export default function EditProduct() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [categories, setCategories] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [variants, setVariants] = useState<any[]>([])
  const [newVariantName, setNewVariantName] = useState('')
  const [newVariantStock, setNewVariantStock] = useState('')
  const [newVariantSku, setNewVariantSku] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: product }, { data: imgs }, { data: vars }] =
        await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('products').select('*').eq('id', id).single(),
          supabase
            .from('product_images')
            .select('*')
            .eq('product_id', id)
            .order('display_order'),
          supabase.from('product_variants').select('*').eq('product_id', id),
        ])

      if (cats) setCategories(cats)

      if (product) {
        setName(product.name)
        setSlug(product.slug)
        setDescription(product.description || '')
        setPrice(String(product.price))
        setCategoryId(product.category_id || '')
        setIsActive(product.is_active)
      }

      if (imgs) setImages(imgs)
      if (vars) setVariants(vars)

      setLoading(false)
    }

    load()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error } = await supabase
      .from('products')
      .update({
        name,
        slug,
        description,
        price: parseFloat(price),
        category_id: categoryId || null,
        is_active: isActive,
      })
      .eq('id', id)

    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      router.push('/admin/products')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      router.push('/admin/products')
    }
  }

  const addImage = async () => {
    if (!newImageUrl.trim()) return

    const { data, error } = await supabase
      .from('product_images')
      .insert({
        product_id: id,
        image_url: newImageUrl,
        display_order: images.length,
      })
      .select()
      .single()

    if (data) {
      setImages([...images, data])
      setNewImageUrl('')
    }
  }

  const deleteImage = async (imageId: string) => {
    await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId)

    setImages(images.filter((img) => img.id !== imageId))
  }

  const addVariant = async () => {
    if (!newVariantName.trim()) return

    const { data, error } = await supabase
      .from('product_variants')
      .insert({
        product_id: id,
        variant_name: newVariantName,
        stock_quantity: parseInt(newVariantStock) || 0,
        sku: newVariantSku || null,
      })
      .select()
      .single()

    if (data) {
      setVariants([...variants, data])
      setNewVariantName('')
      setNewVariantStock('')
      setNewVariantSku('')
    }
  }
  const updateVariantStock = async (variantId: string, newStock: number) => {
  const { error } = await supabase
    .from('product_variants')
    .update({ stock_quantity: newStock })
    .eq('id', variantId)

  if (error) {
    alert('Failed to update stock: ' + error.message)
    console.error('Stock update error:', error)
    return
  }

  setVariants(variants.map((v) =>
    v.id === variantId ? { ...v, stock_quantity: newStock } : v
  ))
}
  const deleteVariant = async (variantId: string) => {
    await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId)

    setVariants(variants.filter((v) => v.id !== variantId))
  }

  if (loading) {
    return <div className={styles.wrapper}>Loading...</div>
  }

  return (
    <div className={styles.wrapper}>
      <h1>Edit Product</h1>

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Slug
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
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
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

        <button
          type="submit"
          disabled={saving}
          className={formStyles.submitBtn}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className={formStyles.deleteBtn}
        >
          Delete Product
        </button>
      </form>

      {/* IMAGES SECTION */}
      <div className={formStyles.section}>
        <h2>Images</h2>

        <div className={formStyles.imageGrid}>
          {images.map((img) => (
            <div key={img.id} className={formStyles.imageCard}>
              <img src={img.image_url} alt="" />
              <button onClick={() => deleteImage(img.id)}>Remove</button>
            </div>
          ))}
        </div>

        <div className={formStyles.addRow}>
          <input
            type="text"
            placeholder="Image URL (e.g. https://placehold.co/600x600)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />

          <button onClick={addImage} type="button">
            Add Image
          </button>
        </div>
      </div>

      {/* VARIANTS SECTION */}
      <div className={formStyles.section}>
        <h2>Variants</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Variant</th>
              <th>Stock</th>
              <th>SKU</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {variants.map((v) => (
  <tr key={v.id}>
    <td>{v.variant_name}</td>
    <td>
      <input
        type="number"
        defaultValue={v.stock_quantity}
        onBlur={(e) => updateVariantStock(v.id, parseInt(e.target.value) || 0)}
        style={{ width: '60px', padding: '4px 6px', border: '1px solid #E8DFD3' }}
      />
    </td>
    <td>{v.sku || '—'}</td>
    <td>
      <button onClick={() => deleteVariant(v.id)} className={styles.editLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        Remove
      </button>
    </td>
  </tr>
))}
          </tbody>
        </table>

        <div className={formStyles.addRow}>
          <input
            type="text"
            placeholder="Variant name (e.g. Gold)"
            value={newVariantName}
            onChange={(e) => setNewVariantName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            value={newVariantStock}
            onChange={(e) => setNewVariantStock(e.target.value)}
          />

          <input
            type="text"
            placeholder="SKU (optional)"
            value={newVariantSku}
            onChange={(e) => setNewVariantSku(e.target.value)}
          />

          <button onClick={addVariant} type="button">
            Add Variant
          </button>
        </div>
      </div>
    </div>
  )
}