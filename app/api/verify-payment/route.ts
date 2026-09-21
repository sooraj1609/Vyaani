import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await request.json()

    console.log('Verify payment called with order_id:', order_id)

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const { data: orderItems } = await supabaseAdmin
      .from('order_items')
      .select('product_variant_id, quantity')
      .eq('order_id', order_id)

    if (orderItems) {
      for (const item of orderItems) {
        const { data: variant } = await supabaseAdmin
          .from('product_variants')
          .select('stock_quantity')
          .eq('id', item.product_variant_id)
          .single()

        if (variant) {
          const newStock = Math.max(0, variant.stock_quantity - item.quantity)
          await supabaseAdmin
            .from('product_variants')
            .update({ stock_quantity: newStock })
            .eq('id', item.product_variant_id)
        }
      }
    }

    await supabaseAdmin
      .from('orders')
      .update({ status: 'paid', payment_id: razorpay_payment_id })
      .eq('id', order_id)

    // Fetch full order details for the emails
    const { data: fullOrder } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, product_variants(variant_name, products(name)))')
      .eq('id', order_id)
      .single()

    if (fullOrder) {
      const itemsHtml = fullOrder.order_items
        .map(
          (item: any) =>
            `<tr>
              <td style="padding:8px 0;">${item.product_variants?.products?.name} (${item.product_variants?.variant_name}) × ${item.quantity}</td>
              <td style="padding:8px 0; text-align:right;">₹${item.price_at_purchase * item.quantity}</td>
            </tr>`
        )
        .join('')

      // Email to customer
      await resend.emails.send({
        from: 'Vyaani Accessories <orders@vyaani.in>',
        to: fullOrder.customer_email,
        subject: `Order Confirmed — #${fullOrder.id.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #7A1C2B;">Thank you for your order, ${fullOrder.customer_name}!</h2>
            <p>Your order <strong>#${fullOrder.id.slice(0, 8).toUpperCase()}</strong> has been confirmed.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              ${itemsHtml}
            </table>
            <p style="font-size: 18px; font-weight: bold; color: #7A1C2B;">Total: ₹${fullOrder.total_amount}</p>
            <p>Shipping to: ${fullOrder.shipping_address}</p>
            <p style="margin-top: 30px; color: #6B5D52; font-size: 13px;">— Vyaani Accessories</p>
          </div>
        `,
      })

      // Alert email to you (the store owner)
      await resend.emails.send({
        from: 'Vyaani Orders <orders@vyaani.in>',
        to: 'soorajkottamasu@gmail.com',
        subject: `New Order — ₹${fullOrder.total_amount} from ${fullOrder.customer_name}`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h3>New order received</h3>
            <p><strong>${fullOrder.customer_name}</strong> (${fullOrder.customer_email}, ${fullOrder.customer_phone})</p>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
            </table>
            <p><strong>Total: ₹${fullOrder.total_amount}</strong></p>
            <p>Ship to: ${fullOrder.shipping_address}</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Payment verification failed:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}