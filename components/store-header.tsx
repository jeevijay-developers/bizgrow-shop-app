"use client"

import type React from "react"
import Image from "next/image"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

interface StoreHeaderProps {
  storeName?: string
  showBack?: boolean
  showSearch?: boolean
  title?: string
  onSearch?: (query: string) => void
  deliveryLocation?: string
}

export function StoreHeader({
  storeName = "Shop Local",
  showSearch = true,
  onSearch,
  deliveryLocation = "HSR Layout, Sector 6, Bangalore",
}: StoreHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "JS"

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <header className="bg-background border-b border-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-center mb-3">
          <Image
            src="/images/biz-grow-logo-guideline-removebg-preview.png"
            alt="Biz Grow 360"
            width={180}
            height={40}
            className="object-contain"
            priority
          />
        </div>

        {/* Top bar with location and user avatar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-xs">📍</span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Deliver to:</div>
              <div className="text-sm font-medium flex items-center gap-1">
                {deliveryLocation}
                <button className="text-muted-foreground">▼</button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              {userInitials}
            </div>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vegetables, milk, atta..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-muted/50 border-0 h-11"
            />
          </div>
        )}
      </div>
    </header>
  )
}
