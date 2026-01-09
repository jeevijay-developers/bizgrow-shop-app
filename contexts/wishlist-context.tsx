"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WishlistContextType {
  wishlist: Set<string>
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load wishlist from localStorage on mount
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      setWishlist(new Set(JSON.parse(storedWishlist)))
    }
  }, [])

  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    localStorage.setItem("wishlist", JSON.stringify(Array.from(wishlist)))
  }, [wishlist])

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev)
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId)
      } else {
        newWishlist.add(productId)
      }
      return newWishlist
    })
  }

  const isWishlisted = (productId: string) => {
    return wishlist.has(productId)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
