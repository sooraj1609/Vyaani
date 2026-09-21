import { supabase } from '@/lib/supabase'
import ProductDetailClient from './ProductDetailClient'
import RelatedProducts from './RelatedProducts'
import Breadcrumbs from '@/components/Breadcrumbs'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: product } = await supabase
    .from('products')
    .select('*, product_images(image_url, display_order), product_variants(*), categories(name, slug)')
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

  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*, product_images(image_url, display_order)')
    .eq('category_id', product.category_id)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(4)

  return (
    <>
      <Breadcrumbs
        items={[
          ...(product.categories
            ? [{ label: product.categories.name, href: `/category/${product.categories.slug}` }]
            : []),
          { label: product.name },
        ]}
      />
      <ProductDetailClient product={product} />
      <RelatedProducts products={relatedProducts || []} />
    </>
  )
}