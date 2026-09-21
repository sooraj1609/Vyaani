'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from './dashboard.module.css'

export default function AccountDashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      supabase
        .from('orders')
        .select('*, order_items(quantity)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setOrders(data)
          setOrdersLoading(false)
        })
    }
  }, [user])

  if (loading || !user) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1>My Account</h1>
          <p className={styles.email}>{user.email}</p>
        </div>
        <button onClick={() => { signOut(); router.push('/') }} className={styles.signOutBtn}>
          Sign Out
        </button>
      </div>

      <h2 className={styles.sectionTitle}>Order History</h2>

      {ordersLoading && <p>Loading orders...</p>}

      {!ordersLoading && orders.length === 0 && (
        <div className={styles.empty}>
          <p>No orders yet.</p>
          <Link href="/" className={styles.shopLink}>Start Shopping</Link>
        </div>
      )}

      <div className={styles.orderList}>
        {orders.map((order) => {
          const itemCount = order.order_items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
          return (
            <div key={order.id} className={styles.orderCard}>
              <div>
                <p className={styles.orderId}>Order {order.id.slice(0, 8).toUpperCase()}</p>
                <p className={styles.orderMeta}>
                  {new Date(order.created_at).toLocaleDateString('en-IN')} · {itemCount} item{itemCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className={styles.orderRight}>
                <span className={styles.orderStatus}>{order.status}</span>
                <span className={styles.orderTotal}>₹{order.total_amount}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}