"use client"

import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { ProductCard } from "@/components/product-card"
import { ProductCarousel } from "@/components/product-carousel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"
import { getStoreCatalog, getStoreCategories, type StoreProduct } from "@/lib/store-api"
import { useTenantSlug } from "@/lib/tenant"

export default function HomePage() {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const [searchQuery, setSearchQuery] = useState("")
  const tenantSlug = useTenantSlug()
  const [categories, setCategories] = useState<string[]>([])
  const [allProducts, setAllProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const filteredProducts = searchQuery
    ? allProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allProducts

  const popularProducts = filteredProducts.slice(0, 6)
  const mostSellingProducts = filteredProducts.slice(6, 12)

  // Load categories once per tenant
  useEffect(() => {
    let cancelled = false
    if (!tenantSlug) return

    getStoreCategories(tenantSlug)
      .then((cats) => {
        if (!cancelled) setCategories(cats)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load categories")
      })

    return () => {
      cancelled = true
    }
  }, [tenantSlug])

  // Load products with optional search
  useEffect(() => {
    const controller = new AbortController()
    if (!tenantSlug) return

    setLoading(true)
    setError("")

    getStoreCatalog({ tenantSlug, limit: 20, search: searchQuery || undefined, inStock: true, signal: controller.signal })
      .then((res) => setAllProducts(res.items))
      .catch((err) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [tenantSlug, searchQuery])

  return (
    <div className="min-h-screen pb-20 lg:pb-0 bg-background">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader showSearch onSearch={setSearchQuery} />

        <main className="max-w-md lg:max-w-7xl mx-auto">
          <div className="px-4 pt-4 pb-2">
            <Card className="bg-gradient-to-r from-primary via-purple-700 to-primary text-primary-foreground overflow-hidden relative">
              <div className="flex items-center justify-between p-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1 text-balance leading-tight">
                    Freshness delivered to your doorstep
                  </h2>
                  <div className="text-accent font-bold mb-3 text-sm">UP TO 30% OFF</div>
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                    asChild
                  >
                    <Link href={tenantSlug ? `/${tenantSlug}/products` : "/products"}>Shop Now</Link>
                  </Button>
                </div>
                <div className="w-32 h-32 relative flex-shrink-0 ml-4">
                  <div className="absolute inset-0 bg-white rounded-2xl rotate-6 shadow-lg" />
                  <Image
                    src="/fresh-vegetables-hero.jpg"
                    alt="Fresh vegetables"
                    fill
                    className="object-cover rounded-2xl relative z-10"
                  />
                </div>
              </div>
            </Card>
          </div>

          <section className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Shop by Category</h2>
              <Button variant="link" className="text-primary p-0 h-auto font-semibold" asChild>
                <Link href={tenantSlug ? `/store/${tenantSlug}/categories` : "/categories"}>View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {categories.length === 0 && !loading && <p className="col-span-4 text-sm text-muted-foreground">No categories yet.</p>}
              {categories.map((name) => {
                const categoryHref = tenantSlug
                  ? `/store/${tenantSlug}/categories/${encodeURIComponent(name)}`
                  : `/categories/${encodeURIComponent(name)}`

                return (
                  <Link href={categoryHref} key={name}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                        <Image
                          src="/placeholder.svg"
                          alt={name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="text-xs font-medium text-center leading-tight">{name}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Popular Products</h2>
              <Button variant="link" className="text-primary p-0 h-auto font-semibold" asChild>
                <Link href={tenantSlug ? `/store/${tenantSlug}/products` : "/products"}>See More</Link>
              </Button>
            </div>

            {loading && <p className="text-sm text-muted-foreground">Loading products...</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!loading && popularProducts.length === 0 && !error && (
              <p className="text-sm text-muted-foreground">Products will appear here once added in the dashboard.</p>
            )}
            {popularProducts.length > 0 && (
              <ProductCarousel autoScroll autoScrollInterval={3000}>
                {popularProducts.map((product) => {
                  const productHref = tenantSlug
                    ? `/store/${tenantSlug}/products/${product.slug}`
                    : `/products/${product.slug}`

                  return (
                    <div key={product.id} className="snap-start">
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        comparePrice={product.comparePrice}
                        image={product.image}
                        unit={product.unit}
                        href={productHref}
                        onAddToCart={() =>
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            unit: product.unit || "piece",
                            image: product.image,
                          })
                        }
                        onToggleWishlist={() => toggleWishlist(product.id)}
                        isWishlisted={isWishlisted(product.id)}
                      />
                    </div>
                  )
                })}
              </ProductCarousel>
            )}
          </section>

          <section className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Most Selling</h2>
            </div>

            {mostSellingProducts.length > 0 && (
              <ProductCarousel autoScroll autoScrollInterval={3000}>
                {mostSellingProducts.map((product) => {
                  const productHref = tenantSlug
                    ? `/store/${tenantSlug}/products/${product.slug}`
                    : `/products/${product.slug}`

                  return (
                    <div key={product.id} className="snap-start">
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        comparePrice={product.comparePrice}
                        image={product.image}
                        unit={product.unit}
                        href={productHref}
                        onAddToCart={() =>
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            unit: product.unit || "piece",
                            image: product.image,
                          })
                        }
                        onToggleWishlist={() => toggleWishlist(product.id)}
                        isWishlisted={isWishlisted(product.id)}
                      />
                    </div>
                  )
                })}
              </ProductCarousel>
            )}
          </section>

          <section className="px-4 py-4 pb-8">
            <Card className="bg-accent/10 border-accent/20 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Refer & Earn</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Invite your neighbors to Biz Grow 360 and get ₹50 off your next order.
                </p>
                <Button className="w-[400px] bg-primary hover:bg-primary/90">Refer Now</Button>
              </div>
            </Card>
          </section>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
