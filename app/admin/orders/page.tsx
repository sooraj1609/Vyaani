import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from '../products/products.module.css'

export default async function AdminOrders() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(quantity)')
    .order('created_at', { ascending: false })

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Orders</h1>
      </div>

      {error && <p className={styles.error}>Error loading orders: {error.message}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => {
            const itemCount = order.order_items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
            return (
              <tr key={order.id}>
                <td>{order.id.slice(0, 8).toUpperCase()}</td>
                <td>{order.customer_name}</td>
                <td>{itemCount} item{itemCount !== 1 ? 's' : ''}</td>
                <td>₹{order.total_amount}</td>
                <td>
                  <span
                    className={order.status === 'paid' ? styles.active : styles.inactive}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                <td>
                  <Link href={`/admin/orders/${order.id}`} className={styles.editLink}>
                    View
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {orders?.length === 0 && <p className={styles.empty}>No orders yet.</p>}
    </div>
  )
}