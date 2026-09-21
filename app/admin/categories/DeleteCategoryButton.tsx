'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from '../products/products.module.css'

export default function DeleteCategoryButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this category? Products using it will be unassigned.')) return

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <button onClick={handleDelete} className={styles.editLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
      Delete
    </button>
  )
}