"use client"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "history">("ongoing")

  const ongoingOrders = [
    {
      id: "BG-1029",
      date: "Today, 10:30 AM",
      status: "Out for Delivery",
      statusColor: "primary",
      items: [
        { image: "/fresh-vegetables-hero.jpg", alt: "Fresh vegetables" },
        { image: "/atta-rice-category.jpg", alt: "Wheat flour" },
        { image: "/cooking-oil-bottle.png", alt: "Cooking oil" },
      ],
      moreItems: 2,
      totalItems: 5,
      total: 1240.5,
    },
    {
      id: "BG-1035",
      date: "Today, 09:15 AM",
      status: "Processing",
      statusColor: "orange",
      items: [
        { image: "/whole-milk-bottle.jpg", alt: "Milk" },
        { image: "/fresh-potatoes-bag.jpg", alt: "Bread" },
      ],
      moreItems: 0,
      totalItems: 2,
      total: 450.0,
    },
  ]

  const historyOrders = [
    {
      id: "BG-0982",
      date: "12 Oct 2023, 04:15 PM",
      status: "Delivered",
      statusColor: "green",
      items: [
        { image: "/fresh-onions.png", alt: "Spices" },
        { image: "/hybrid-tomatoes.jpg", alt: "Lentils" },
        { image: "/basmati-rice-bag.jpg", alt: "Rice" },
      ],
      moreItems: 0,
      totalItems: 3,
      total: 2890.0,
      canReorder: true,
    },
    {
      id: "BG-0851",
      date: "05 Oct 2023, 11:20 AM",
      status: "Cancelled",
      statusColor: "red",
      items: [{ image: "/robust-bananas-bunch.jpg", alt: "Soft drinks" }],
      moreItems: 0,
      totalItems: 1,
      total: 120.0,
      canReorder: true,
    },
  ]

  const displayedOrders = activeTab === "ongoing" ? ongoingOrders : historyOrders

  return (
    <div className="min-h-screen pb-20 lg:pb-0 bg-background-light dark:bg-background-dark">
      <DesktopSidebar />

      <div className="lg:ml-64">
        {/* Top App Bar */}
        <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b">
          <div className="flex items-center p-4 justify-between max-w-md lg:max-w-3xl mx-auto">
            <Link href="/" className="flex items-center justify-center">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h2 className="text-lg font-bold flex-1 text-center">My Orders</h2>
            <button className="flex items-center justify-center w-12 h-12">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <main className="max-w-md lg:max-w-3xl mx-auto">
          {/* Segmented Control */}
          <div className="px-4 py-3">
            <div className="flex h-12 items-center justify-center rounded-xl bg-[#eee7f3] dark:bg-[#2d1b3d] p-1.5">
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`flex h-full grow items-center justify-center rounded-lg px-4 text-sm font-semibold transition-all ${
                  activeTab === "ongoing"
                    ? "bg-white dark:bg-[#3e2654] shadow-sm text-primary"
                    : "text-[#794c9a] dark:text-[#b08ec7]"
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex h-full grow items-center justify-center rounded-lg px-4 text-sm font-semibold transition-all ${
                  activeTab === "history"
                    ? "bg-white dark:bg-[#3e2654] shadow-sm text-primary"
                    : "text-[#794c9a] dark:text-[#b08ec7]"
                }`}
              >
                History
              </button>
            </div>
          </div>

          {/* Orders Section */}
          <div className="space-y-4 px-4 pb-6">
            <h3 className="text-lg font-bold pt-2">{activeTab === "ongoing" ? "Ongoing Orders" : "Order History"}</h3>

            {displayedOrders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden border-[#eee7f3] dark:border-[#3e2654] bg-white dark:bg-[#251830]"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-primary font-bold text-lg">#{order.id}</p>
                      <p className="text-[#794c9a] dark:text-[#b08ec7] text-xs font-medium">{order.date}</p>
                    </div>
                    <Badge
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        order.statusColor === "primary"
                          ? "bg-primary/10 text-primary"
                          : order.statusColor === "orange"
                            ? "bg-orange-100 text-orange-600"
                            : order.statusColor === "green"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  {/* Item Thumbnails */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="h-14 w-14 shrink-0 rounded-lg bg-cover bg-center border border-gray-100 dark:border-gray-800 overflow-hidden relative"
                      >
                        <Image src={item.image || "/placeholder.svg"} alt={item.alt} fill className="object-cover" />
                      </div>
                    ))}
                    {order.moreItems > 0 && (
                      <div className="h-14 w-14 shrink-0 rounded-lg bg-[#eee7f3] dark:bg-[#3e2654] flex items-center justify-center text-primary font-bold text-xs border border-gray-100 dark:border-gray-800">
                        +{order.moreItems}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#eee7f3] dark:border-[#3e2654]">
                    <div className="flex flex-col">
                      <p className="text-[#794c9a] dark:text-[#b08ec7] text-xs">{order.totalItems} Items • Total</p>
                      <p className="text-lg font-bold">₹{order.total.toFixed(2)}</p>
                    </div>
                    <Button
                      className={`min-w-[120px] h-10 text-sm font-bold shadow-md ${
                        order.canReorder
                          ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent/20"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                      }`}
                    >
                      {order.canReorder ? "Reorder" : "Track Order"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
