"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Heart, Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield } from "lucide-react"

interface AuthPageProps {
  onSuccess: (role: string) => void
}

export function AuthPage({ onSuccess }: AuthPageProps) {
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      if (isLogin) {
        const result = login(email, password)
        if (result.success) {
          onSuccess(result.role || "user")
        } else {
          setError(result.error || "Login failed")
        }
      } else {
        if (!name.trim()) { setError("Name is required"); setLoading(false); return }
        if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return }
        const result = signup(name, email, password)
        if (result.success) {
          onSuccess("user")
        } else {
          setError(result.error || "Signup failed")
        }
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - branding */}
      <div className="hidden flex-1 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <Heart className="h-10 w-10 text-[hsl(46,97%,65%)]" fill="currentColor" />
            <h1 className="text-3xl font-bold tracking-tight">HealthCart</h1>
          </div>
          <p className="mt-2 text-sm text-primary-foreground/70">Cloud-Based Real-Time Monitoring Platform</p>
        </div>

        <div className="space-y-8">
          <h2 className="text-balance text-4xl font-bold leading-tight">
            Your Personalized Health & Wellness Marketplace
          </h2>
          <div className="space-y-4">
            {[
              "BMI-based personalized diet recommendations",
              "Premium health supplements & equipment",
              "Real-time behavior monitoring & analytics",
              "Secure authentication & user management",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(46,97%,65%)] text-xs font-bold text-foreground">
                  {i + 1}
                </div>
                <span className="text-sm text-primary-foreground/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-primary-foreground/50">
          Final Year Project - Web Monitoring System
        </p>
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        {/* Mobile branding */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <Heart className="h-8 w-8 text-primary" fill="currentColor" />
          <h1 className="text-2xl font-bold text-foreground">HealthCart</h1>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLogin ? "Sign in to your account" : "Join HealthCart today"}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Demo Credentials
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-md bg-background px-3 py-2">
                <div>
                  <span className="font-semibold text-foreground">User Login:</span>
                  <span className="ml-2 text-muted-foreground">user@healthcart.com / user123</span>
                </div>
                <button
                  onClick={() => { setEmail("user@healthcart.com"); setPassword("user123"); setIsLogin(true); }}
                  className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Fill
                </button>
              </div>
              <div className="flex items-center justify-between rounded-md bg-background px-3 py-2">
                <div>
                  <span className="font-semibold text-foreground">Admin Login:</span>
                  <span className="ml-2 text-muted-foreground">admin@healthcart.com / admin123</span>
                </div>
                <button
                  onClick={() => { setEmail("admin@healthcart.com"); setPassword("admin123"); setIsLogin(true); }}
                  className="rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/90"
                >
                  Fill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
