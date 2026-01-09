"use client"

import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ProductsPage() {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const [filter, setFilter] = useState<"all" | "sale">("all")

  // Mock products data - would come from API
  const allProducts = [
    {
      id: "1",
      name: "Fresh Tomatoes",
      price: 40,
      comparePrice: 50,
      image: "/fresh-red-tomatoes.jpg",
      unit: "kg",
      rating: 4.5,
      reviews: 128,
    },
    {
      id: "2",
      name: "Tata Salt",
      price: 22,
      comparePrice: 25,
      image: "/tata-salt-packet.jpg",
      unit: "1kg",
      rating: 4.8,
      reviews: 256,
    },
    {
      id: "3",
      name: "Amul Milk",
      price: 28,
      image: "/amul-milk-packet.jpg",
      unit: "500ml",
      rating: 4.7,
      reviews: 189,
    },
    {
      id: "4",
      name: "Aashirvaad Atta",
      price: 280,
      comparePrice: 310,
      image: "/aashirvaad-atta-flour.jpg",
      unit: "5kg",
      rating: 4.6,
      reviews: 342,
    },
    {
      id: "5",
      name: "Fresh Onions",
      price: 35,
      comparePrice: 42,
      image: "/fresh-onions.png",
      unit: "kg",
      rating: 4.4,
      reviews: 95,
    },
    {
      id: "6",
      name: "Basmati Rice",
      price: 180,
      comparePrice: 200,
      image: "/basmati-rice-bag.jpg",
      unit: "5kg",
      rating: 4.7,
      reviews: 203,
    },
    {
      id: "7",
      name: "Fortune Oil",
      price: 145,
      image: "/cooking-oil-bottle.png",
      unit: "1L",
      rating: 4.5,
      reviews: 167,
    },
    {
      id: "8",
      name: "Fresh Potatoes",
      price: 30,
      comparePrice: 35,
      image: "/fresh-potatoes.png",
      unit: "kg",
      rating: 4.3,
      reviews: 84,
    },
  ]

  const products = filter === "sale" ? allProducts.filter((p) => p.comparePrice) : allProducts

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader title="All Products" showBack showSearch />

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
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => addToCart(product)}
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
