import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from './products.module.css'

export default async function AdminProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Products</h1>
        <Link href="/admin/products/new" className={styles.addBtn}>
          + Add Product
        </Link>
      </div>

      {error && <p className={styles.error}>Error loading products: {error.message}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.categories?.name || '—'}</td>
              <td>₹{product.price}</td>
              <td>
                <span className={product.is_active ? styles.active : styles.inactive}>
                  {product.is_active ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td>
                <Link href={`/admin/products/${product.id}`} className={styles.editLink}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products?.length === 0 && <p className={styles.empty}>No products yet. Add your first one.</p>}
    </div>
  )
}