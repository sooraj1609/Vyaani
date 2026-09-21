import Hero from '@/components/Hero'
import CategoryStrip from '@/components/CategoryStrip'
import CampaignBanner from '@/components/CampaignBanner'
import FeaturedProducts from '@/components/FeaturedProducts'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <CampaignBanner />
      <FeaturedProducts />
      <Newsletter />
      <Footer />
    </>
  )
}