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
import { useState } from "react"
import Image from "next/image"

export default function HomePage() {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { id: "1", name: "Vegetables & Fruit", image: "/fresh-vegetables-category.jpg" },
    { id: "2", name: "Atta & Rice", image: "/atta-rice-category.jpg" },
    { id: "3", name: "Dairy & Bread", image: "/dairy-bread-category.jpg" },
    { id: "4", name: "Snacks & Drinks", image: "/snacks-drinks-category.jpg" },
  ]

  const popularProducts = [
    {
      id: "1",
      name: "Fresh Carrots",
      price: 45,
      comparePrice: 65,
      image: "/fresh-carrots-bundle.jpg",
      unit: "500 g",
      rating: 4.5,
      reviews: 128,
    },
    {
      id: "2",
      name: "Whole Milk",
      price: 64,
      image: "/whole-milk-bottle.jpg",
      unit: "1 L",
      rating: 4.8,
      reviews: 256,
    },
    {
      id: "3",
      name: "Amul Butter",
      price: 54,
      image: "/amul-butter-pack.jpg",
      unit: "100 g",
      rating: 4.7,
      reviews: 189,
    },
  ]

  const mostSellingProducts = [
    {
      id: "4",
      name: "Hybrid Tomatoes",
      price: 38,
      image: "/hybrid-tomatoes.jpg",
      unit: "1 kg",
      rating: 4.6,
      reviews: 342,
    },
    {
      id: "5",
      name: "Red Onions",
      price: 42,
      image: "/red-onions-fresh.jpg",
      unit: "1 kg",
      rating: 4.5,
      reviews: 298,
    },
    {
      id: "6",
      name: "Fresh Potatoes",
      price: 32,
      image: "/fresh-potatoes-bag.jpg",
      unit: "2 kg",
      rating: 4.7,
      reviews: 412,
    },
    {
      id: "7",
      name: "Robust Bananas",
      price: 28,
      image: "/robust-bananas-bunch.jpg",
      unit: "6 units",
      rating: 4.8,
      reviews: 523,
    },
  ]

  const allProducts = [...popularProducts, ...mostSellingProducts]
  const filteredProducts = searchQuery
    ? allProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allProducts

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
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                    Shop Now
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
                <Link href="/categories">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {categories.map((category) => (
                <Link href={`/categories/${category.id}`} key={category.id}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Popular Products</h2>
              <Button variant="link" className="text-primary p-0 h-auto font-semibold" asChild>
                <Link href="/products">See More</Link>
              </Button>
            </div>

            <ProductCarousel autoScroll autoScrollInterval={3000}>
              {popularProducts.map((product) => (
                <div key={product.id} className="w-[170px] snap-start">
                  <ProductCard
                    {...product}
                    onAddToCart={() => addToCart(product)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    isWishlisted={isWishlisted(product.id)}
                  />
                </div>
              ))}
            </ProductCarousel>
          </section>

          <section className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Most Selling</h2>
            </div>

            <ProductCarousel autoScroll autoScrollInterval={3000}>
              {mostSellingProducts.map((product) => (
                <div key={product.id} className="w-[170px] snap-start">
                  <ProductCard
                    {...product}
                    onAddToCart={() => addToCart(product)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    isWishlisted={isWishlisted(product.id)}
                  />
                </div>
              ))}
            </ProductCarousel>
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
                <Button className="w-full bg-primary hover:bg-primary/90">Refer Now</Button>
              </div>
            </Card>
          </section>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
