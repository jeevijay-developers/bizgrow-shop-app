"use client"

import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getStoreCatalog, type StoreProduct } from "@/lib/store-api"
import { useTenantSlug } from "@/lib/tenant"

export default function ProductsPage() {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const [filter, setFilter] = useState<"all" | "sale">("all")
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const tenantSlug = useTenantSlug()
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [pagination, setPagination] = useState<{ page: number; pages: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const filteredProducts = filter === "sale"
    ? products.filter((p) => p.comparePrice && p.comparePrice > p.price)
    : products

  useEffect(() => {
    const controller = new AbortController()
    if (!tenantSlug) return

    setLoading(true)
    setError("")

    getStoreCatalog({ tenantSlug, page, limit: 24, search: search || undefined, inStock: true, signal: controller.signal })
      .then((res) => {
        setProducts((prev) => (page === 1 ? res.items : [...prev, ...res.items]))
        setPagination({ page: res.pagination.page, pages: res.pagination.pages })
      })
      .catch((err) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [tenantSlug, page, search])

  const handleSearch = (query: string) => {
    setPage(1)
    setProducts([])
    setSearch(query)
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader title="All Products" showBack showSearch onSearch={handleSearch} />

        <main className="max-w-md lg:max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="flex-1"
            >
              All Products
            </Button>
            <Button variant={filter === "sale" ? "default" : "outline"} onClick={() => setFilter("sale")}>
              On Sale
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {loading && <p className="col-span-2 text-sm text-muted-foreground">Loading products...</p>}
            {error && <p className="col-span-2 text-sm text-destructive">{error}</p>}
            {!loading && filteredProducts.length === 0 && !error && (
              <p className="col-span-2 text-sm text-muted-foreground">No products found.</p>
            )}
            {filteredProducts.map((product) => {
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

          {pagination && pagination.pages > pagination.page && (
            <div className="flex justify-center mt-6">
              <Button onClick={() => setPage((p) => p + 1)} disabled={loading} variant="outline">
                Load more
              </Button>
            </div>
          )}
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
