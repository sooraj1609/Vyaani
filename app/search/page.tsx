import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from '../category/[slug]/category.module.css'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  const { data: products } = query
    ? await supabase
        .from('products')
        .select('*, product_images(image_url, display_order)')
        .eq('is_active', true)
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className={styles.wrapper}>
      <h1>Search results for "{query}"</h1>

      {products?.length === 0 && (
        <p className={styles.empty}>No products found. Try a different search term.</p>
      )}

      <div className={styles.grid}>
        {products?.map((product) => {
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