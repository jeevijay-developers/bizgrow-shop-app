"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3x3, ShoppingCart, User, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"
import { useTenantSlug } from "@/lib/tenant"
import { useEffect, useState } from "react"
import { getStoreInfo } from "@/lib/store-api"

export function DesktopSidebar() {
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const cartCount = getTotalItems()
  const tenantSlug = useTenantSlug()

  const [storeName, setStoreName] = useState("Shop Local")
  const [storeTagline, setStoreTagline] = useState("Your Store")

  useEffect(() => {
    if (!tenantSlug) return
    let cancelled = false
    getStoreInfo(tenantSlug)
      .then((store) => {
        if (cancelled) return
        setStoreName(store?.name || "Shop Local")
        setStoreTagline(store?.slug || tenantSlug)
      })
      .catch(() => {
        if (cancelled) return
        setStoreName("Shop Local")
        setStoreTagline(tenantSlug)
      })

    return () => {
      cancelled = true
    }
  }, [tenantSlug])

  const withTenant = (path: string) => (tenantSlug ? `/store/${tenantSlug}${path}` : path)

  const navItems = [
    { href: withTenant("/"), icon: Home, label: "Home" },
    { href: withTenant("/categories"), icon: Grid3x3, label: "Categories" },
    { href: withTenant("/cart"), icon: ShoppingCart, label: "Cart", badge: cartCount },
    { href: withTenant("/profile"), icon: User, label: "Profile" },
  ]

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 bg-white border-r border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">{storeName}</h1>
            <p className="text-xs text-muted-foreground">{storeTagline}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge
                      className={cn(
                        "ml-auto",
                        isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground",
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
