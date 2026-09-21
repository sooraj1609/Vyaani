import { supabase } from '@/lib/supabase'
import styles from './FeaturedProducts.module.css'

export default async function FeaturedProducts() {
  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(image_url, display_order)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <section className={styles.featured}>
      <h2>New arrivals</h2>
      <div className={styles.grid}>
        {products?.map((product) => {
          const image = product.product_images?.sort(
            (a: any, b: any) => a.display_order - b.display_order
          )[0]

          return (
            <div key={product.id} className={styles.card}>
              <div className={styles.image}>
                {image ? (
                  <img src={image.image_url} alt={product.name} />
                ) : (
                  'Product photo'
                )}
              </div>
              <h4>{product.name}</h4>
              <span className={styles.price}>₹{product.price}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}