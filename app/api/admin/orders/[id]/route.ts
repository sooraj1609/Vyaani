import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status, tracking_number, courier_name } = await request.json()

  // Get the current status before updating, to detect the transition
  const { data: existingOrder } = await supabaseAdmin
    .from('orders')
    .select('status, customer_email, customer_name')
    .eq('id', id)
    .single()

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status, tracking_number, courier_name })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send a "shipped" email only when status newly changes to shipped
  if (existingOrder && existingOrder.status !== 'shipped' && status === 'shipped') {
    await resend.emails.send({
      from: 'Vyaani Accessories <orders@vyaani.in>',
      to: existingOrder.customer_email,
      subject: `Your order has shipped! — #${id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #7A1C2B;">Good news, ${existingOrder.customer_name}!</h2>
          <p>Your order <strong>#${id.slice(0, 8).toUpperCase()}</strong> is on its way.</p>
          ${courier_name ? `<p><strong>Courier:</strong> ${courier_name}</p>` : ''}
          ${tracking_number ? `<p><strong>Tracking Number:</strong> ${tracking_number}</p>` : ''}
          <p>You can check your order status anytime at <a href="https://vyaani.in/track-order">vyaani.in/track-order</a>.</p>
          <p style="margin-top: 30px; color: #6B5D52; font-size: 13px;">— Vyaani Accessories</p>
        </div>
      `,
    })
  }

  return NextResponse.json({ order: data })
}