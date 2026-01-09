"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  id: string
  name: string
  price: number
  comparePrice?: number
  image: string
  unit?: string
  rating?: number
  reviews?: number
  onAddToCart?: () => void
  onToggleWishlist?: () => void
  isWishlisted?: boolean
}

export function ProductCard({
  id,
  name,
  price,
  comparePrice,
  image,
  unit = "piece",
  rating,
  reviews,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden relative group h-[380px] flex flex-col rounded-2xl flex-shrink-0 snap-start min-w-[280px] w-[280px]">
      <button
        onClick={(e) => {
          e.preventDefault()
          onToggleWishlist?.()
        }}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
        />
      </button>

      <Link href={`/products/${id}`} className="flex flex-col h-full">
        <div className="h-48 relative bg-gradient-to-br from-purple-100 to-purple-200 flex-shrink-0">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain p-4" />
        </div>

        <div className="p-4 space-y-2 flex-1 flex flex-col bg-white">
          <h3 className="font-bold text-base line-clamp-2 text-balance min-h-[2.5rem]">{name}</h3>

          <div className="flex items-center gap-2 text-xs">
            {unit && <span className="text-muted-foreground font-medium">{unit}</span>}
            {rating && (
              <div className="flex items-center gap-1">
                <span className="text-secondary">★</span>
                <span className="font-medium">{rating}</span>
                <span className="text-muted-foreground">({reviews})</span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">₹{price}</span>
                {comparePrice && comparePrice > price && (
                  <span className="text-xs text-muted-foreground line-through">₹{comparePrice}</span>
                )}
              </div>

              {comparePrice && comparePrice > price && (
                <Badge className="bg-red-500 text-white text-xs font-bold">
                  {Math.round(((comparePrice - price) / comparePrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            <Button
              onClick={(e) => {
                e.preventDefault()
                onAddToCart?.()
              }}
              className="w-full bg-primary hover:bg-primary/90 h-10 text-sm font-semibold"
            >
              ADD
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  )
}
