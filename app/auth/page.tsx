"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function AuthPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneOrEmail, setPhoneOrEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const { login } = useAuth()
  const router = useRouter()

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("otp")
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const mockUser = {
      id: "1",
      name: "Guest User",
      phone: phoneOrEmail.includes("@") ? "+91 98765 43210" : phoneOrEmail,
      email: phoneOrEmail.includes("@") ? phoneOrEmail : undefined,
    }
    login(mockUser)
    router.push("/")
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      <header className="p-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-6">
          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
                <p className="text-muted-foreground">Enter your phone number or email to continue</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Phone Number or Email</Label>
                <Input
                  id="contact"
                  type="text"
                  placeholder="+91 98765 43210 or email@example.com"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                Send OTP
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔐</span>
                </div>
                <h1 className="text-2xl font-bold mb-2">Enter OTP</h1>
                <p className="text-muted-foreground">We've sent a 6-digit code to</p>
                <p className="font-semibold">{phoneOrEmail}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-bold"
                    />
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="link" className="text-sm text-primary p-0">
                    Resend OTP
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                Verify & Continue
              </Button>

              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("phone")}>
                Change Phone/Email
              </Button>
            </form>
          )}
        </Card>
      </main>
    </div>
  )
}
