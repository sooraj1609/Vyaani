import Link from 'next/link'
import styles from './admin.module.css'

export default function AdminDashboard() {
  return (
    <div className={styles.wrapper}>
      <h1>Vyaani Admin</h1>
      <div className={styles.grid}>
        <Link href="/admin/products" className={styles.card}>
          <h2>Products</h2>
          <p>Add, edit, and manage your catalog</p>
        </Link>
        <Link href="/admin/categories" className={styles.card}>
          <h2>Categories</h2>
          <p>Manage product categories</p>
        </Link>
        <Link href="/admin/orders" className={styles.card}>
          <h2>Orders</h2>
          <p>View and manage customer orders</p>
        </Link>
        <Link href="/admin/coupons" className={styles.card}>
          <h2>Coupons</h2>
          <p>Manage discount codes</p>
        </Link>
      </div>
    </div>
  )
}