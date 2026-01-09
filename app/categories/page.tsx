"use client"

import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function CategoriesPage() {
  const categories = [
    { id: "1", name: "Groceries & Staples", icon: "🛒", count: 245 },
    { id: "2", name: "Fresh Vegetables", icon: "🥬", count: 58 },
    { id: "3", name: "Fresh Fruits", icon: "🍎", count: 42 },
    { id: "4", name: "Dairy & Eggs", icon: "🥛", count: 34 },
    { id: "5", name: "Snacks & Namkeen", icon: "🍿", count: 156 },
    { id: "6", name: "Beverages", icon: "🥤", count: 89 },
    { id: "7", name: "Personal Care", icon: "🧴", count: 124 },
    { id: "8", name: "Household Items", icon: "🧹", count: 97 },
    { id: "9", name: "Breakfast & Cereals", icon: "🥣", count: 45 },
    { id: "10", name: "Cooking Essentials", icon: "🍳", count: 78 },
    { id: "11", name: "Bakery & Biscuits", icon: "🍪", count: 112 },
    { id: "12", name: "Baby Care", icon: "🍼", count: 56 },
  ]

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader title="Categories" showSearch />

        <main className="max-w-md lg:max-w-3xl mx-auto px-4 py-4">
          <div className="space-y-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="p-5 hover:shadow-lg hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{category.name}</h3>
                        <p className="text-sm text-primary">{category.count} products</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
