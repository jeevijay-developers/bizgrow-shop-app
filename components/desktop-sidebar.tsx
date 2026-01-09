"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3x3, ShoppingCart, User, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"

export function DesktopSidebar() {
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const cartCount = getTotalItems()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/categories", icon: Grid3x3, label: "Categories" },
    { href: "/cart", icon: ShoppingCart, label: "Cart", badge: cartCount },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 bg-white border-r border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Shop Local</h1>
            <p className="text-xs text-muted-foreground">Kirana Store</p>
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
