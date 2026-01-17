"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getStoreCategories } from "@/lib/store-api"

export default function CategoriesPage() {
  const router = useRouter()
  const params = useParams()
  const tenantSlug = decodeURIComponent((params?.slug || "").toString())

  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!tenantSlug) return

    setLoading(true)
    setError("")
    getStoreCategories(tenantSlug)
      .then((cats) => setCategories(cats || []))
      .catch((err) => setError(err.message || "Failed to load categories"))
      .finally(() => setLoading(false))
  }, [tenantSlug])

  useEffect(() => {
    if (!tenantSlug) router.replace("/")
  }, [tenantSlug, router])

  const categoryHref = (name: string) => `/store/${tenantSlug}/categories/${encodeURIComponent(name)}`

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
            {categories.map((name) => (
              <Link key={name} href={categoryHref(name)}>
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
            ))}
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
