import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from '../products/products.module.css'
import DeleteCouponButton from './DeleteCouponButton'
import ToggleActiveButton from './ToggleActiveButton'

export default async function AdminCoupons() {
  const { data: coupons, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Coupons</h1>
        <Link href="/admin/coupons/new" className={styles.addBtn}>
          + Add Coupon
        </Link>
      </div>

      {error && <p className={styles.error}>Error loading coupons: {error.message}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons?.map((coupon) => (
            <tr key={coupon.id}>
              <td>{coupon.code}</td>
              <td>{coupon.discount_type === 'percentage' ? 'Percentage' : 'Flat Amount'}</td>
              <td>
                {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
              </td>
              <td><ToggleActiveButton id={coupon.id} isActive={coupon.is_active} /></td>
              <td>
                <DeleteCouponButton id={coupon.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {coupons?.length === 0 && <p className={styles.empty}>No coupons yet.</p>}
    </div>
  )
}