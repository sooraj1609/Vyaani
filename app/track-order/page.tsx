'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './track-order.module.css'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    const res = await fetch(`/api/order/${orderId.trim()}`)
    const data = await res.json()

    if (!res.ok || !data.order) {
      setError('Order not found. Please check your Order ID.')
      setLoading(false)
      return
    }

    if (data.order.customer_email.toLowerCase() !== email.trim().toLowerCase()) {
      setError('Email does not match this order.')
      setLoading(false)
      return
    }

    setOrder(data.order)
    setLoading(false)
  }

  return (
    <div className={styles.wrapper}>
      <h1>Track Your Order</h1>

      {!order && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Order ID
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 029E85F5"
              required
            />
          </label>

          <label>
            Email used at checkout
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Track Order'}
          </button>
        </form>
      )}

      {order && (
        <div className={styles.result}>
          <div className={styles.row}>
            <span>Order ID</span>
            <span>{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className={styles.row}>
            <span>Status</span>
            <span className={styles.status}>{order.status}</span>
          </div>
          <div className={styles.row}>
            <span>Total</span>
            <span>₹{order.total_amount}</span>
          </div>
          <div className={styles.row}>
            <span>Placed on</span>
            <span>{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
          </div>
          {order.tracking_number && (
  <div className={styles.trackingBox}>
    <p><strong>Courier:</strong> {order.courier_name || 'N/A'}</p>
    <p><strong>Tracking Number:</strong> {order.tracking_number}</p>
  </div>
)}

          <h3>Items</h3>
          {order.order_items?.map((item: any) => (
            <div key={item.id} className={styles.itemRow}>
              <span>
                {item.product_variants?.products?.name} ({item.product_variants?.variant_name}) × {item.quantity}
              </span>
              <span>₹{item.price_at_purchase * item.quantity}</span>
            </div>
          ))}

          <button onClick={() => setOrder(null)} className={styles.searchAgain}>
            Track another order
          </button>
        </div>
      )}

      <p className={styles.helpText}>
        Have an account? <Link href="/account">View all your orders here</Link>
      </p>
    </div>
  )
}