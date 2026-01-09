"use client"

import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useParams } from "next/navigation"

export default function CategoryProductsPage() {
  const params = useParams()
  const categoryId = params.id as string
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  // Mock category data - would come from API
  const categories: Record<string, { name: string; icon: string }> = {
    "1": { name: "Groceries & Staples", icon: "🛒" },
    "2": { name: "Fresh Vegetables", icon: "🥬" },
    "3": { name: "Fresh Fruits", icon: "🍎" },
    "4": { name: "Dairy & Eggs", icon: "🥛" },
    "5": { name: "Snacks & Namkeen", icon: "🍿" },
    "6": { name: "Beverages", icon: "🥤" },
  }

  const category = categories[categoryId] || { name: "Category", icon: "🛒" }

  // Mock products for the category
  const products = [
    {
      id: `${categoryId}-1`,
      name: "Fresh Tomatoes",
      price: 40,
      comparePrice: 50,
      image: "/fresh-red-tomatoes.jpg",
      unit: "kg",
      rating: 4.5,
      reviews: 128,
      description: "Fresh, juicy tomatoes perfect for salads and cooking. Farm fresh quality.",
    },
    {
      id: `${categoryId}-2`,
      name: "Tata Salt",
      price: 22,
      comparePrice: 25,
      image: "/tata-salt-packet.jpg",
      unit: "1kg",
      rating: 4.8,
      reviews: 256,
      description: "India's trusted salt brand. Pure and iodized for healthy living.",
    },
    {
      id: `${categoryId}-3`,
      name: "Amul Milk",
      price: 28,
      image: "/amul-milk-packet.jpg",
      unit: "500ml",
      rating: 4.7,
      reviews: 189,
      description: "Fresh homogenized toned milk. The taste of India in every glass.",
    },
    {
      id: `${categoryId}-4`,
      name: "Aashirvaad Atta",
      price: 280,
      comparePrice: 310,
      image: "/aashirvaad-atta-flour.jpg",
      unit: "5kg",
      rating: 4.6,
      reviews: 342,
      description: "Whole wheat flour made from 100% MP wheat. Perfect for soft rotis.",
    },
    {
      id: `${categoryId}-5`,
      name: "Fresh Onions",
      price: 35,
      comparePrice: 42,
      image: "/fresh-onions.png",
      unit: "kg",
      rating: 4.4,
      reviews: 95,
      description: "Premium quality onions for daily cooking needs. Fresh and flavorful.",
    },
    {
      id: `${categoryId}-6`,
      name: "Basmati Rice",
      price: 180,
      comparePrice: 200,
      image: "/basmati-rice-bag.jpg",
      unit: "5kg",
      rating: 4.7,
      reviews: 203,
      description: "Long grain basmati rice with authentic aroma. Perfect for biryani.",
    },
  ]

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader title={category.name} showBack showSearch />

        <main className="max-w-md lg:max-w-7xl mx-auto px-4 py-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-4xl">{category.icon}</span>
              <h1 className="text-2xl font-bold">{category.name}</h1>
            </div>
            <p className="text-muted-foreground">{products.length} products available</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
