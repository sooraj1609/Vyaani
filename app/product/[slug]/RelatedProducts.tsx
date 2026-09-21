import Link from 'next/link'
import styles from './related.module.css'

export default function RelatedProducts({ products }: { products: any[] }) {
  if (products.length === 0) return null

  return (
    <section className={styles.section}>
      <h2>You may also like</h2>
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
    </section>
  )
}