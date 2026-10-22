import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import styles from './Footer.module.css'

export default async function Footer() {
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('created_at', { ascending: true })

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.col}>
          <h5>Shop</h5>
          {categories?.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              {cat.name}
            </Link>
          ))}
        </div>

        <div className={styles.col}>
          <h5>Help</h5>
          <Link href="/track-order">Track order</Link>
          <Link href="/returns">Returns and exchange</Link>
          <Link href="/shipping">Shipping info</Link>
          <Link href="/contact">Contact us</Link>
        </div>

        <div className={styles.col}>
          <h5>About</h5>
          <Link href="/about">Our story</Link>
          <a
            href="https://www.instagram.com/vyaani_accessories"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>

        <div className={styles.col}>
          <h5>Newsletter</h5>
          <Link href="/#newsletter">Sign up for offers</Link>
          <a href="mailto:help@vyaani.in">help@vyaani.in</a>
        </div>
      </div>

      <div className={styles.bottom}>
        © 2026 Vyaani Accessories. All rights reserved.
      </div>
    </footer>
  )
}