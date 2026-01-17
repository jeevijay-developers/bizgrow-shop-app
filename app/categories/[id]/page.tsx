"use client"

import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { getStoreCatalog, type StoreProduct } from "@/lib/store-api"
import { useTenantSlug } from "@/lib/tenant"

export default function CategoryProductsPage() {
  const params = useParams()
  const categoryId = params.id as string
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const tenantSlug = useTenantSlug()
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const categoryName = useMemo(() => decodeURIComponent(categoryId || "Category"), [categoryId])

  useEffect(() => {
    const controller = new AbortController()
    if (!tenantSlug || !categoryName) return

    setLoading(true)
    setError("")
    getStoreCatalog({ tenantSlug, category: categoryName, limit: 40, inStock: true, signal: controller.signal })
      .then((res) => setProducts(res.items))
      .catch((err) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [tenantSlug, categoryName])

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader title={categoryName} showBack showSearch />

        <main className="max-w-md lg:max-w-7xl mx-auto px-4 py-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-4xl">🛒</span>
              <h1 className="text-2xl font-bold">{categoryName}</h1>
            </div>
            <p className="text-muted-foreground">{products.length} products available</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {loading && <p className="col-span-2 text-sm text-muted-foreground">Loading products...</p>}
            {error && <p className="col-span-2 text-sm text-destructive">{error}</p>}
            {!loading && products.length === 0 && !error && (
              <p className="col-span-2 text-sm text-muted-foreground">No products found in this category.</p>
            )}
            {products.map((product) => {
              const productHref = tenantSlug
                ? `/store/${tenantSlug}/products/${product.slug}`
                : `/products/${product.slug}`

              return (
                <ProductCard
                  key={product.id}
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
              )
            })}
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
