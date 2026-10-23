import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import styles from '../products/products.module.css'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminOrders() {
  const { data, error: dbError } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(quantity)')
    .order('created_at', { ascending: false })

  const orders = data ?? []
  const error = dbError?.message ?? null

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Orders</h1>
      </div>

      {error && (
        <p className={styles.error}>
          Error loading orders: {error}
        </p>
      )}

      {!error && (
        <>
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
              {orders.map((order: any) => {
                const itemCount =
                  order.order_items?.reduce(
                    (sum: number, item: any) =>
                      sum + item.quantity,
                    0
                  ) ?? 0

                return (
                  <tr key={order.id}>
                    <td>
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td>{order.customer_name}</td>
                    <td>
                      {itemCount} item
                      {itemCount !== 1 ? 's' : ''}
                    </td>
                    <td>
                      ₹
                      {Number(order.total_amount).toLocaleString(
                        'en-IN'
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          order.status === 'paid'
                            ? styles.active
                            : styles.inactive
                        }
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {new Date(
                        order.created_at
                      ).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className={styles.editLink}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className={styles.empty}>No orders yet.</p>
          )}
        </>
      )}
    </div>
  )
}
