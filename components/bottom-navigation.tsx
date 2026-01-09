"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"

export function BottomNavigation() {
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const cartCount = getTotalItems()

  const navItems = [
    { href: "/", icon: "home", label: "Home" },
    { href: "/categories", icon: "grid_view", label: "Categories" },
    { href: "/orders", icon: "receipt_long", label: "Orders" },
    { href: "/cart", icon: "shopping_cart", label: "Cart", badge: cartCount },
    { href: "/profile", icon: "person_outline", label: "Profile" },
  ]

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 lg:hidden shadow-2xl safe-area-inset-bottom">
        <div className="flex items-center justify-between px-6 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center space-y-1 text-slate-400 dark:text-slate-500 transition-colors relative",
                  isActive && "text-primary",
                )}
              >
                <div
                  className="relative -mt-8 w-14 h-14 bg-primary rounded-full shadow-2xl shadow-primary/20 flex items-center justify-center"
                  style={{ display: isActive && item.href === "/cart" ? "flex" : "none" }}
                >
                  <span className="material-icons-outlined text-3xl text-white fill-1">{item.icon}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div
                  className={cn("flex flex-col items-center gap-0.5", isActive && item.href === "/cart" && "hidden")}
                >
                  <span
                    className="material-icons-outlined text-2xl"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  {item.badge && item.badge > 0 && item.href === "/cart" && !isActive && (
                    <span className="absolute -top-1 right-1/4 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={cn("text-[10px] font-bold uppercase", isActive && item.href === "/cart" && "hidden")}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </>
  )
}
