'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './SearchOverlay.module.css'

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, price, product_images(image_url, display_order)')
        .eq('is_active', true)
        .ilike('name', `%${query.trim()}%`)
        .limit(6)

      setResults(data || [])
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleViewAll = () => {
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleViewAll()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for earrings, necklaces..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>

        {loading && <p className={styles.status}>Searching...</p>}

        {!loading && query.trim().length >= 2 && results.length === 0 && (
          <p className={styles.status}>No products found for "{query}"</p>
        )}

        {results.length > 0 && (
          <div className={styles.results}>
            {results.map((product) => {
              const image = product.product_images?.sort(
                (a: any, b: any) => a.display_order - b.display_order
              )[0]
              return (
                <a
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className={styles.resultItem}
                  onClick={onClose}
                >
                  <div className={styles.resultImage}>
                    {image ? <img src={image.image_url} alt={product.name} /> : null}
                  </div>
                  <div className={styles.resultInfo}>
                    <span className={styles.resultName}>{product.name}</span>
                    <span className={styles.resultPrice}>₹{product.price}</span>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {query.trim().length >= 2 && (
          <button onClick={handleViewAll} className={styles.viewAllBtn}>
            View all results for "{query}"
          </button>
        )}
      </div>
    </div>
  )
}