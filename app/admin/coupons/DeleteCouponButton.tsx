'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from '../products/products.module.css'

export default function DeleteCouponButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this coupon?')) return

    const { error } = await supabase.from('coupons').delete().eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      className={styles.editLink}
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    >
      Delete
    </button>
  )
}