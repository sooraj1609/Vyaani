'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from '../products/products.module.css'

export default function ToggleActiveButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter()

  const handleToggle = async () => {
    await supabase.from('coupons').update({ is_active: !isActive }).eq('id', id)
    router.refresh()
  }

  return (
    <button
      onClick={handleToggle}
      className={isActive ? styles.active : styles.inactive}
      style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
    >
      {isActive ? 'Active' : 'Inactive'}
    </button>
  )
}