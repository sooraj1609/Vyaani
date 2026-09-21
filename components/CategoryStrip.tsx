import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import styles from './CategoryStrip.module.css'

export default async function CategoryStrip() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <section className={styles.strip}>
      <h2>Shop by category</h2>
      <div className={styles.scroll}>
        {categories?.map((cat) => (
          <Link href={`/category/${cat.slug}`} key={cat.id} className={styles.item}>
            <div className={styles.circle}>Image</div>
            <span className={styles.label}>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}