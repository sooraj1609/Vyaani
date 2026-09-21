import { supabase } from '@/lib/supabase'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: product } = await supabase
    .from('products')
    .select('*, product_images(image_url, display_order), product_variants(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    return (
      <div style={{ padding: '60px 40px', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
        <p>Product not found.</p>
      </div>
    )
  }

  return <ProductDetailClient product={product} />
}