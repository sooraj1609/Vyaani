import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from 'next/headers'
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from '@/lib/AuthContext'
import Header from "@/components/Header";
import { WishlistProvider } from '@/lib/WishlistContext'
import CartDrawer from "@/components/CartDrawer";
import ComingSoonGate from '@/components/ComingSoonGate'
import { Analytics } from '@vercel/analytics/next'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vyaani | Fast Fashion Jewelry",
  description: "Fast-fashion jewelry, crafted for the moment.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {isAdminRoute ? (
                <>{children}</>
              ) : (
                <ComingSoonGate>
                  <Header />
                  {children}
                  <CartDrawer />
                </ComingSoonGate>
              )}
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
        <Analytics />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </body>
    </html>
  )
}