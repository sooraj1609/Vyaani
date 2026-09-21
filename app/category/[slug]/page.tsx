import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from './category.module.css'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()


  if (!category) {
    return (
      <div className={styles.wrapper}>
        <p>Category not found.</p>
      </div>
    )
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(image_url, display_order)')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className={styles.wrapper}>
      <h1>{category.name}</h1>

      {products?.length === 0 && (
        <p className={styles.empty}>No products in this category yet.</p>
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