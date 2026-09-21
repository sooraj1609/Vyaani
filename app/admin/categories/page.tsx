import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from '../products/products.module.css'
import DeleteCategoryButton from './DeleteCategoryButton'

export default async function AdminCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Categories</h1>
        <Link href="/admin/categories/new" className={styles.addBtn}>
          + Add Category
        </Link>
      </div>

      {error && <p className={styles.error}>Error loading categories: {error.message}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.slug}</td>
              <td>
                <DeleteCategoryButton id={cat.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {categories?.length === 0 && <p className={styles.empty}>No categories yet.</p>}
    </div>
  )
}