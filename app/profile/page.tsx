"use client"

import { StoreHeader } from "@/components/store-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, MapPin, ShoppingBag, Heart, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth()
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editName, setEditName] = useState(user?.name || "")
  const [editPhone, setEditPhone] = useState(user?.phone || "")

  if (!isAuthenticated) {
    router.push("/auth")
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSaveProfile = () => {
    updateProfile({ name: editName, phone: editPhone })
    setIsEditDialogOpen(false)
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0 bg-muted/30">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <StoreHeader title="Profile" />

        <main className="max-w-md lg:max-w-3xl mx-auto px-4 py-4">
          {/* User Info */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.phone}</p>
              </div>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium">My Orders</span>
            </Card>

            <Card className="p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-sm font-medium">Wishlist</span>
            </Card>
          </div>

          {/* Menu Options */}
          <Card className="divide-y mb-4">
            <MenuOption icon={MapPin} label="Saved Addresses" />
            <MenuOption icon={Bell} label="Notifications" badge="3" />
            <MenuOption icon={HelpCircle} label="Help & Support" />
          </Card>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 h-12 text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}

function MenuOption({ icon: Icon, label, badge }: { icon: any; label: string; badge?: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {badge}
          </span>
        )}
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </button>
  )
}
