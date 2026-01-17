"use client"
import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { getStoreCategories } from "@/lib/store-api"
import { useTenantSlug } from "@/lib/tenant"

export default function CategoriesPage() {
  const tenantSlug = useTenantSlug()
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    if (!tenantSlug) return

    setLoading(true)
    setError("")
    getStoreCategories(tenantSlug)
      .then((cats) => !cancelled && setCategories(cats))
      .catch((err) => !cancelled && setError(err.message || "Failed to load categories"))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [tenantSlug])

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader title="Categories" showSearch />

        <main className="max-w-md lg:max-w-3xl mx-auto px-4 py-4">
          <div className="space-y-3">
            {loading && <p className="text-sm text-muted-foreground">Loading categories...</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!loading && categories.length === 0 && !error && (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            )}
            {categories.map((name) => {
              const href = tenantSlug
                ? `/store/${tenantSlug}/categories/${encodeURIComponent(name)}`
                : `/categories/${encodeURIComponent(name)}`

              return (
                <Link key={name} href={href}>
                  <Card className="p-5 hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-base">{name}</h3>
                          <p className="text-sm text-muted-foreground">Browse products</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
