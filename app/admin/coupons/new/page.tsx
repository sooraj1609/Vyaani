'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from '../../products/products.module.css'
import formStyles from '../../products/new/form.module.css'

export default function NewCoupon() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error } = await supabase.from('coupons').insert({
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      is_active: isActive,
    })

    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      router.push('/admin/coupons')
    }
  }

  return (
    <div className={styles.wrapper}>
      <h1>Add Coupon</h1>

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <label>
          Coupon Code
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. WELCOME10"
            required
          />
        </label>

        <label>
          Discount Type
          <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat Amount (₹)</option>
          </select>
        </label>

        <label>
          Discount Value
          <input
            type="number"
            step="0.01"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder={discountType === 'percentage' ? 'e.g. 10' : 'e.g. 100'}
            required
          />
        </label>

        <label className={formStyles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active (customers can use this code)
        </label>

        {error && <p className={formStyles.error}>{error}</p>}

        <button type="submit" disabled={saving} className={formStyles.submitBtn}>
          {saving ? 'Saving...' : 'Save Coupon'}
        </button>
      </form>
    </div>
  )
}