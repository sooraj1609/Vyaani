'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from '../../products/products.module.css'
import formStyles from '../../products/new/form.module.css'

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderDetail() {
  const params = useParams()
  const id = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*, product_variants(variant_name, products(name)))')
        .eq('id', id)
        .single()

      if (data) {
        setOrder(data)
        setStatus(data.status)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const updateStatus = async () => {
    setSaving(true)
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) {
      setOrder({ ...order, status })
    }
    setSaving(false)
  }

  if (loading) return <div className={styles.wrapper}>Loading...</div>
  if (!order) return <div className={styles.wrapper}>Order not found.</div>

  return (
    <div className={styles.wrapper}>
      <h1>Order {order.id.slice(0, 8).toUpperCase()}</h1>

      <div className={formStyles.section} style={{ maxWidth: 600 }}>
        <h2>Customer</h2>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#2A0E12' }}>
          {order.customer_name}<br />
          {order.customer_email}<br />
          {order.customer_phone}
        </p>
      </div>

      <div className={formStyles.section} style={{ maxWidth: 600 }}>
        <h2>Shipping Address</h2>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#2A0E12' }}>
          {order.shipping_address}
        </p>
      </div>

      <div className={formStyles.section} style={{ maxWidth: 600 }}>
        <h2>Items</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item: any) => (
              <tr key={item.id}>
                <td>{item.product_variants?.products?.name}</td>
                <td>{item.product_variants?.variant_name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price_at_purchase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={formStyles.section} style={{ maxWidth: 600 }}>
        <h2>Payment</h2>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#2A0E12' }}>
          Total: ₹{order.total_amount}<br />
          Payment ID: {order.payment_id || '—'}
        </p>
      </div>

      <div className={formStyles.section} style={{ maxWidth: 600 }}>
        <h2>Status</h2>
        <div className={formStyles.addRow}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #E8DFD3', fontFamily: 'Arial, sans-serif' }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={updateStatus} disabled={saving} type="button">
            {saving ? 'Saving...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  )
}