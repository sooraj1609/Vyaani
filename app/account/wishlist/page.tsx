'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from '../../category/[slug]/category.module.css'

export default function WishlistPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      supabase
        .from('wishlist_items')
        .select('product_id, products(*, product_images(image_url, display_order))')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) setProducts(data.map((item: any) => item.products).filter(Boolean))
          setFetching(false)
        })
    }
  }, [user])

  if (loading || !user || fetching) return null

  return (
    <div className={styles.wrapper}>
      <h1>My Wishlist</h1>

      {products.length === 0 && <p className={styles.empty}>Your wishlist is empty.</p>}

      <div className={styles.grid}>
        {products.map((product) => {
          const image = product.product_images?.sort(
            (a: any, b: any) => a.display_order - b.display_order
          )[0]

          return (
            <Link href={`/product/${product.slug}`} key={product.id} className={styles.card}>
              <div className={styles.image}>
                {image ? <img src={image.image_url} alt={product.name} /> : 'Product photo'}
              </div>
              <h4>{product.name}</h4>
              <span className={styles.price}>₹{product.price}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}