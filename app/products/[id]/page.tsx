"use client"

import { useEffect, useMemo, useState } from "react"
import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Minus, Plus, Star } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useParams } from "next/navigation"
import { getStoreProduct, type StoreProduct } from "@/lib/store-api"
import { useTenantSlug } from "@/lib/tenant"

export default function ProductDetailPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const tenantSlug = useTenantSlug()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<StoreProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const productSlug = useMemo(() => decodeURIComponent(params.id as string), [params.id])

  useEffect(() => {
    const controller = new AbortController()
    if (!tenantSlug || !productSlug) return

    setLoading(true)
    setError("")
    getStoreProduct(tenantSlug, productSlug, controller.signal)
      .then((p) => {
        setProduct(p)
        setSelectedImage(0)
      })
      .catch((err) => setError(err.message || "Failed to load product"))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [tenantSlug, productSlug])

  const handleAddToCart = () => {
    if (!product) return

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit || "piece",
        image: product.image || "/placeholder.svg",
      },
      quantity,
    )
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0 bg-gradient-to-b from-purple-100 to-white">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader title="Product Details" showBack />

        <main className="max-w-md lg:max-w-4xl mx-auto px-4 py-4">
          <Card className="overflow-hidden">
            {/* Main Image */}
            <div className="relative h-80 lg:h-96 bg-gradient-to-br from-purple-200 to-purple-300">
              <button
                onClick={() => product && toggleWishlist(product.id)}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2.5 shadow-md hover:scale-110 transition-transform"
                disabled={!product}
              >
                <Heart
                  className={`w-6 h-6 ${
                    product && isWishlisted(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
              <Image
                src={(product?.images?.[selectedImage]?.url || product?.image || "/placeholder.svg") as string}
                alt={product?.name || "Product"}
                fill
                className="object-contain p-8"
              />

              {/* Image dots indicator */}
              {product?.images?.length ? (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === selectedImage ? "bg-primary w-6" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {/* Thumbnail Gallery */}
            {product?.images?.length ? (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === selectedImage ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img.url || "/placeholder.svg"}
                      alt={`${product.name} ${idx + 1}`}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            {/* Product Info */}
            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-xl font-bold text-balance pr-2">{product?.name || "Product"}</h1>
                {product?.isActive && (
                  <div className="flex items-center gap-1 text-sm flex-shrink-0">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="font-semibold">4.8</span>
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {loading && <p className="text-sm text-muted-foreground">Loading product...</p>}

              <div className="text-3xl font-bold">₹{product?.price?.toFixed(2) || "0.00"}</div>

              {product?.comparePrice && product.comparePrice > product.price && (
                <p className="text-sm text-muted-foreground line-through">MRP ₹{product.comparePrice}</p>
              )}

              {product?.description && <p className="text-sm text-muted-foreground">{product.description}</p>}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button onClick={handleAddToCart} disabled={!product || loading} className="w-full h-12 text-base font-semibold">
                Add to cart
              </Button>
            </div>
          </Card>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
