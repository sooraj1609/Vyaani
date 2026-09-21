import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const isFullUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  let order = null
  let error = null

  if (isFullUuid) {
    const result = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, product_variants(variant_name, products(name)))')
      .eq('id', id)
      .single()
    order = result.data
    error = result.error
  } else {
    // Fetch recent orders and match the short ID prefix in JavaScript,
    // since Postgres can't pattern-match a uuid column directly
    const result = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, product_variants(variant_name, products(name)))')
    const match = result.data?.find((o) =>
      o.id.toLowerCase().startsWith(id.toLowerCase())
    )
    order = match || null
    error = result.error
  }

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({ order })
}