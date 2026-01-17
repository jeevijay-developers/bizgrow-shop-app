"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { getStoreCatalog, type StoreProduct } from "@/lib/store-api"

export default function CategoryProductsPage() {
  const router = useRouter()
  const params = useParams()
  const tenantSlug = decodeURIComponent((params?.slug || "").toString())
  const category = useMemo(
    () => decodeURIComponent((params?.category || "").toString()),
    [params?.category]
  )
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const [products, setProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!tenantSlug || !category) return

    setLoading(true)
    setError("")
    const controller = new AbortController()

    getStoreCatalog({ tenantSlug, category, limit: 40, inStock: true, signal: controller.signal })
      .then((res) => setProducts(res.items || []))
      .catch((err) => {
        if (err?.name === "AbortError") return
        setError(err.message || "Failed to load category")
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [tenantSlug, category])

  useEffect(() => {
    if (!tenantSlug) router.replace("/")
  }, [tenantSlug, router])

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader title={category || "Category"} showBack />

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <h1 className="text-3xl font-bold">{category}</h1>
              <p className="text-muted-foreground">{products.length} products available</p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {loading && !error && <p className="text-sm text-muted-foreground">Loading products...</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {!loading && products.length === 0 && !error && (
              <p className="col-span-2 text-sm text-muted-foreground">No products found in this category.</p>
            )}

            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                comparePrice={product.comparePrice}
                image={product.image}
                unit={product.unit}
                href={`/store/${tenantSlug}/products/${product.slug}`}
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
            ))}
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
