"use client"

import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MapPin, CreditCard } from "lucide-react"

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [address, setAddress] = useState("")
  const [landmark, setLandmark] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")

  if (!isAuthenticated) {
    router.push("/auth")
    return null
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  const subtotal = getSubtotal()
  const deliveryFee = 20
  const discount = subtotal > 200 ? 40 : 0
  const total = subtotal + deliveryFee - discount

  const handlePlaceOrder = () => {
    // Mock order placement
    alert("Order placed successfully! You will receive a WhatsApp confirmation soon.")
    clearCart()
    router.push("/")
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0 bg-muted/30">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader title="Checkout" showBack />

        <main className="max-w-md lg:max-w-3xl mx-auto px-4 py-4">
          {/* Delivery Address */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Delivery Address</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue={user?.phone} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Complete Address</Label>
                <Textarea
                  id="address"
                  placeholder="House No., Street, Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input
                  id="landmark"
                  placeholder="Near school, temple, etc."
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Payment Method</h2>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex-1 cursor-pointer">
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                </Label>
              </div>
            </RadioGroup>
          </Card>

          {/* Order Summary */}
          <Card className="p-4 mb-4">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items ({items.length})</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="text-muted-foreground">
                You will receive a WhatsApp confirmation with order details and estimated delivery time.
              </p>
            </div>
          </Card>

          {/* Place Order Button */}
          <Button
            onClick={handlePlaceOrder}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
            disabled={!address}
          >
            Place Order - ₹{total}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By placing this order, you agree to our Terms & Conditions
          </p>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
