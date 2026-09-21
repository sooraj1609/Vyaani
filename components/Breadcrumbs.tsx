import Link from 'next/link'
import styles from './Breadcrumbs.module.css'

type Crumb = {
  label: string
  href?: string
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span className={styles.separator}>/</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}