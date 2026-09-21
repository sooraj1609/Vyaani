'use client'
import { v4 as uuidv4 } from 'uuid'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'
import styles from './checkout.module.css'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const { items, subtotal, discount, totalPrice, appliedCoupon, clearCart } = useCart()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setError('')

    try {
      const newOrderId = uuidv4()

      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: newOrderId,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          shipping_address: address,
          total_amount: totalPrice,
          status: 'pending',
        })

      if (orderError) {
        throw new Error(orderError.message)
      }

      const order = { id: newOrderId }

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_variant_id: item.variantId,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        throw new Error(itemsError.message)
      }

      // Check stock availability for each item — before touching Razorpay at all
      for (const item of items) {
        const { data: variant } = await supabase
          .from('product_variants')
          .select('stock_quantity')
          .eq('id', item.variantId)
          .single()

        if (!variant || variant.stock_quantity < item.quantity) {
          // Roll back: delete the order we just created
          await supabase.from('order_items').delete().eq('order_id', order.id)
          await supabase.from('orders').delete().eq('id', order.id)

          throw new Error(
            `Sorry, "${item.name} (${item.variantName})" only has ${variant?.stock_quantity ?? 0} left in stock. Please update your cart.`
          )
        }
      }

      const amountInPaise = Math.round(totalPrice * 100)

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
        }),
      })

      const razorpayOrder = await res.json()

      if (!res.ok) {
        throw new Error(
          razorpayOrder.error || 'Failed to create payment order'
        )
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Vyaani Accessories',
        description: 'Order payment',
        order_id: razorpayOrder.order_id,

        prefill: {
          name,
          email,
          contact: phone,
        },

        theme: {
          color: '#7A1C2B',
        },

        handler: async function (response: any) {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id,
            }),
          })

          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            clearCart()
            router.push(`/order-confirmation/${order.id}`)
          } else {
            setError(
              'Payment verification failed. Please contact support.'
            )
            setProcessing(false)
          }
        },

        modal: {
          ondismiss: function () {
            setProcessing(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', function () {
        setError('Payment failed. Please try again.')
        setProcessing(false)
      })

      rzp.open()
    } catch (err: any) {
      setError(err.message)
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.wrapper}>
        <p>Your bag is empty.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <h1>Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <label>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          <label>
            Shipping Address
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={processing}>
            {processing ? 'Processing...' : `Pay ₹${totalPrice}`}
          </button>
        </form>
      </div>

      <div className={styles.summary}>
        <h2>Order Summary</h2>

        {items.map((item) => (
          <div
            key={item.variantId}
            className={styles.summaryItem}
          >
            <span>
              {item.name} ({item.variantName}) × {item.quantity}
            </span>

            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <div className={styles.summaryDivider} />

        <div className={styles.summaryItem}>
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {appliedCoupon && (
          <div className={styles.summaryItem}>
            <span>Discount ({appliedCoupon.code})</span>
            <span className={styles.discountValue}>−₹{discount}</span>
          </div>
        )}

        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>
    </div>
  )
}