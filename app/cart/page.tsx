'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'
import styles from './cart.module.css'

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    totalPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [checking, setChecking] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setChecking(true)
    setCouponError('')

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponInput.trim().toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !data) {
      setCouponError('Invalid or expired coupon code.')
      setChecking(false)
      return
    }

    applyCoupon({
      code: data.code,
      type: data.discount_type,
      value: data.discount_value,
    })
    setCouponInput('')
    setChecking(false)
  }

  if (items.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>
          <p>Your bag is empty.</p>
          <Link href="/" className={styles.shopLink}>Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <h1>Your Bag</h1>

      <div className={styles.layout}>
        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.variantId} className={styles.item}>
              <div className={styles.itemImage}>
                {item.image ? <img src={item.image} alt={item.name} /> : 'No image'}
              </div>
              <div className={styles.itemDetails}>
                <h3>{item.name}</h3>
                <p className={styles.variant}>{item.variantName}</p>
                <div className={styles.qtyRow}>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className={styles.itemRight}>
                <span className={styles.price}>₹{item.price * item.quantity}</span>
                <button onClick={() => removeItem(item.variantId)} className={styles.remove}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          {appliedCoupon && (
            <div className={styles.summaryRow}>
              <span>Discount ({appliedCoupon.code})</span>
              <span className={styles.discountValue}>−₹{discount}</span>
            </div>
          )}

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          {appliedCoupon ? (
            <div className={styles.couponApplied}>
              <span>Coupon "{appliedCoupon.code}" applied</span>
              <button onClick={removeCoupon}>Remove</button>
            </div>
          ) : (
            <div className={styles.couponBox}>
              <input
                type="text"
                placeholder="Coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button onClick={handleApplyCoupon} disabled={checking}>
                {checking ? 'Checking...' : 'Apply'}
              </button>
            </div>
          )}
          {couponError && <p className={styles.couponError}>{couponError}</p>}

          <Link href="/checkout" className={styles.checkoutBtn}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}