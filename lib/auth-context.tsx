"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { User, CartItem, Order, ActivityLog } from "./store"
import { defaultUsers, products } from "./store"

interface AuthContextType {
  user: User | null
  users: User[]
  cart: CartItem[]
  orders: Order[]
  activityLogs: ActivityLog[]
  emailsSent: Array<{ id: string; recipient: string; subject: string; message: string; timestamp: string }>
  login: (email: string, password: string) => { success: boolean; role?: string; error?: string }
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  placeOrder: () => { success: boolean; orderId?: string }
  logActivity: (action: string, details: string) => void
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void
  suspendUser: (userId: string, reason: string) => void
  unsuspendUser: (userId: string) => void
  sendEmailToUser: (userId: string, subject: string, message: string) => void
  calculateUserRiskScore: (userId: string) => number
  updateUserRiskScore: (userId: string, score: number) => void
  getSuspiciousUsers: () => User[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(defaultUsers)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ord-001",
      userId: "user-demo",
      items: [{ productId: "p1", quantity: 1, price: 49.99 }, { productId: "p3", quantity: 2, price: 19.99 }],
      total: 89.97,
      status: "delivered",
      createdAt: "2025-02-10T09:15:00Z",
    },
    {
      id: "ord-002",
      userId: "user-demo",
      items: [{ productId: "p5", quantity: 1, price: 39.99 }],
      total: 39.99,
      status: "confirmed",
      createdAt: "2025-02-14T16:45:00Z",
    },
  ])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: "log-1", userId: "user-demo", userName: "Demo User", action: "LOGIN", details: "User logged in", timestamp: "2025-02-15T08:00:00Z" },
    { id: "log-2", userId: "user-demo", userName: "Demo User", action: "BMI_CALC", details: "Calculated BMI: 22.9 (Normal)", timestamp: "2025-02-15T08:05:00Z" },
    { id: "log-3", userId: "user-demo", userName: "Demo User", action: "VIEW_PRODUCT", details: "Viewed: Premium Whey Protein", timestamp: "2025-02-15T08:10:00Z" },
    { id: "log-4", userId: "user-demo", userName: "Demo User", action: "ADD_TO_CART", details: "Added: Omega-3 Fish Oil (x2)", timestamp: "2025-02-15T08:12:00Z" },
    { id: "log-5", userId: "user-demo", userName: "Demo User", action: "CHECKOUT", details: "Order placed: $89.97", timestamp: "2025-02-15T08:15:00Z" },
    
    // Suspicious user 1 - John Smith (Risk Score 9 - CRITICAL)
    { id: "log-6", userId: "user-suspicious-1", userName: "John Smith", action: "LOGIN", details: "Failed login attempt", timestamp: "2025-02-22T13:00:00Z" },
    { id: "log-7", userId: "user-suspicious-1", userName: "John Smith", action: "LOGIN", details: "Failed login attempt", timestamp: "2025-02-22T13:02:00Z" },
    { id: "log-8", userId: "user-suspicious-1", userName: "John Smith", action: "LOGIN", details: "Failed login attempt", timestamp: "2025-02-22T13:04:00Z" },
    { id: "log-9", userId: "user-suspicious-1", userName: "John Smith", action: "CHECKOUT", details: "Rapid checkout: $450.00", timestamp: "2025-02-22T13:15:00Z" },
    { id: "log-10", userId: "user-suspicious-1", userName: "John Smith", action: "CHECKOUT", details: "Rapid checkout: $320.00", timestamp: "2025-02-22T13:17:00Z" },
    { id: "log-11", userId: "user-suspicious-1", userName: "John Smith", action: "VIEW_PRODUCT", details: "Viewed: Premium Whey Protein", timestamp: "2025-02-22T13:30:00Z" },
    
    // Suspicious user 2 - Sarah Johnson (Risk Score 8 - HIGH)
    { id: "log-12", userId: "user-suspicious-2", userName: "Sarah Johnson", action: "VIEW_PRODUCT", details: "Viewed: Resistance Bands Set", timestamp: "2025-02-22T12:00:00Z" },
    { id: "log-13", userId: "user-suspicious-2", userName: "Sarah Johnson", action: "VIEW_PRODUCT", details: "Viewed: Premium Whey Protein", timestamp: "2025-02-22T12:01:00Z" },
    { id: "log-14", userId: "user-suspicious-2", userName: "Sarah Johnson", action: "VIEW_PRODUCT", details: "Viewed: Yoga Mat", timestamp: "2025-02-22T12:02:00Z" },
    { id: "log-15", userId: "user-suspicious-2", userName: "Sarah Johnson", action: "VIEW_PRODUCT", details: "Viewed: Protein Energy Bars", timestamp: "2025-02-22T12:03:00Z" },
    { id: "log-16", userId: "user-suspicious-2", userName: "Sarah Johnson", action: "ADD_TO_CART", details: "Added multiple items", timestamp: "2025-02-22T12:10:00Z" },
    { id: "log-17", userId: "user-suspicious-2", userName: "Sarah Johnson", action: "ADD_TO_CART", details: "Added multiple items", timestamp: "2025-02-22T12:11:00Z" },
    { id: "log-18", userId: "user-suspicious-2", userName: "Sarah Johnson", action: "CHECKOUT", details: "Rapid checkout: $280.00", timestamp: "2025-02-22T13:45:00Z" },
    
    // Suspicious user 3 - Mike Chen (Risk Score 7 - HIGH)
    { id: "log-19", userId: "user-suspicious-3", userName: "Mike Chen", action: "LOGIN", details: "Failed login attempt", timestamp: "2025-02-22T11:00:00Z" },
    { id: "log-20", userId: "user-suspicious-3", userName: "Mike Chen", action: "LOGIN", details: "Failed login attempt", timestamp: "2025-02-22T11:02:00Z" },
    { id: "log-21", userId: "user-suspicious-3", userName: "Mike Chen", action: "VIEW_PRODUCT", details: "Viewed: Premium Whey Protein", timestamp: "2025-02-22T11:30:00Z" },
    { id: "log-22", userId: "user-suspicious-3", userName: "Mike Chen", action: "VIEW_PRODUCT", details: "Viewed: BCAA Amino Acids", timestamp: "2025-02-22T11:31:00Z" },
    { id: "log-23", userId: "user-suspicious-3", userName: "Mike Chen", action: "ADD_TO_CART", details: "Added item", timestamp: "2025-02-22T11:35:00Z" },
    { id: "log-24", userId: "user-suspicious-3", userName: "Mike Chen", action: "ADD_TO_CART", details: "Added item", timestamp: "2025-02-22T11:36:00Z" },
    
    // Suspicious user 4 - Emma Wilson (Risk Score 6 - MEDIUM, Already Suspended)
    { id: "log-25", userId: "user-suspicious-4", userName: "Emma Wilson", action: "LOGIN", details: "Unusual login location", timestamp: "2025-02-21T14:00:00Z" },
    { id: "log-26", userId: "user-suspicious-4", userName: "Emma Wilson", action: "CHECKOUT", details: "Large order: $650.00", timestamp: "2025-02-21T14:30:00Z" },
    { id: "log-27", userId: "user-suspicious-4", userName: "Emma Wilson", action: "VIEW_PRODUCT", details: "Viewed: Equipment", timestamp: "2025-02-21T14:35:00Z" },
    
    // Suspicious user 5 - David Lee (Risk Score 5 - MEDIUM, Already Blocked)
    { id: "log-28", userId: "user-suspicious-5", userName: "David Lee", action: "LOGIN", details: "Multiple failed attempts", timestamp: "2025-02-20T10:00:00Z" },
    { id: "log-29", userId: "user-suspicious-5", userName: "David Lee", action: "CHECKOUT", details: "Unauthorized transaction attempt", timestamp: "2025-02-20T10:15:00Z" },
  ])
  const [emailsSent, setEmailsSent] = useState<Array<{ id: string; recipient: string; subject: string; message: string; timestamp: string }>>([])

  const calculateUserRiskScore = useCallback((userId: string) => {
    const userLogs = activityLogs.filter((log) => log.userId === userId)
    const recentDate = new Date()
    recentDate.setHours(recentDate.getHours() - 1)

    let score = 0

    // Failed login attempts
    const failedLoginCount = userLogs.filter((log) => {
      return log.action === "LOGIN" && new Date(log.timestamp) > recentDate
    }).length
    if (failedLoginCount >= 3) score += 2 * (failedLoginCount - 2)

    // Rapid checkout attempts
    const recentCheckouts = userLogs.filter((log) => {
      return log.action === "CHECKOUT" && new Date(log.timestamp) > recentDate
    })
    if (recentCheckouts.length >= 2) score += 3

    // Multiple product views in short time
    const viewCount = userLogs.filter((log) => {
      return log.action === "VIEW_PRODUCT" && new Date(log.timestamp) > recentDate
    }).length
    if (viewCount >= 10) score += 2

    // Add to cart without checkout pattern
    const cartAdds = userLogs.filter((log) => log.action === "ADD_TO_CART").length
    const checkoutCount = userLogs.filter((log) => log.action === "CHECKOUT").length
    if (cartAdds > checkoutCount * 2) score += 1

    return Math.min(score, 10)
  }, [activityLogs])

  const getSuspiciousUsers = useCallback(() => {
    return users.map((u) => ({
      ...u,
      riskScore: calculateUserRiskScore(u.id),
    })).filter((u) => u.role === "user" && (u.riskScore! >= 5 || u.suspended || u.blocked))
  }, [users, calculateUserRiskScore])

  const blockUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, blocked: true, lastFlaggedAt: new Date().toISOString() }
          : u
      )
    )
  }, [])

  const unblockUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, blocked: false } : u))
    )
  }, [])

  const suspendUser = useCallback((userId: string, reason: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              suspended: true,
              suspensionReason: reason,
              lastFlaggedAt: new Date().toISOString(),
            }
          : u
      )
    )
  }, [])

  const unsuspendUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, suspended: false, suspensionReason: undefined } : u))
    )
  }, [])

  const updateUserRiskScore = useCallback((userId: string, score: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, riskScore: score, lastFlaggedAt: new Date().toISOString() }
          : u
      )
    )
  }, [])

  const sendEmailToUser = useCallback((userId: string, subject: string, message: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      const email = {
        id: `email-${Date.now()}`,
        recipient: user.email,
        subject,
        message,
        timestamp: new Date().toISOString(),
      }
      setEmailsSent((prev) => [email, ...prev])
    }
  }, [users])

  const logActivity = useCallback((action: string, details: string) => {
    if (!user) return
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action,
      details,
      timestamp: new Date().toISOString(),
    }
    setActivityLogs((prev) => [log, ...prev])
  }, [user])

  const login = useCallback((email: string, password: string) => {
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) return { success: false, error: "Invalid email or password" }
    setUser(found)
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: found.id,
      userName: found.name,
      action: "LOGIN",
      details: `${found.role === "admin" ? "Admin" : "User"} logged in`,
      timestamp: new Date().toISOString(),
    }
    setActivityLogs((prev) => [log, ...prev])
    return { success: true, role: found.role }
  }, [users])

  const signup = useCallback((name: string, email: string, password: string) => {
    if (users.some((u) => u.email === email)) {
      return { success: false, error: "Email already exists" }
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: "user",
      createdAt: new Date().toISOString(),
    }
    setUsers((prev) => [...prev, newUser])
    setUser(newUser)
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: newUser.id,
      userName: newUser.name,
      action: "SIGNUP",
      details: "New user registered",
      timestamp: new Date().toISOString(),
    }
    setActivityLogs((prev) => [log, ...prev])
    return { success: true }
  }, [users])

  const logout = useCallback(() => {
    if (user) {
      const log: ActivityLog = {
        id: `log-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        action: "LOGOUT",
        details: "User logged out",
        timestamp: new Date().toISOString(),
      }
      setActivityLogs((prev) => [log, ...prev])
    }
    setUser(null)
    setCart([])
  }, [user])

  const updateProfile = useCallback((data: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...data }
    setUser(updated)
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)))
  }, [user])

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { productId, quantity: 1 }]
    })
    const product = products.find((p) => p.id === productId)
    if (product && user) {
      logActivity("ADD_TO_CART", `Added: ${product.name}`)
    }
  }, [user, logActivity])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId))
      return
    }
    setCart((prev) => prev.map((item) => item.productId === productId ? { ...item, quantity } : item))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const placeOrder = useCallback(() => {
    if (cart.length === 0 || !user) return { success: false }
    const orderItems = cart.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return { productId: item.productId, quantity: item.quantity, price: product?.price || 0 }
    })
    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const order: Order = {
      id: `ord-${Date.now()}`,
      userId: user.id,
      items: orderItems,
      total: Math.round(total * 100) / 100,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])
    setCart([])
    logActivity("CHECKOUT", `Order placed: $${order.total.toFixed(2)}`)
    return { success: true, orderId: order.id }
  }, [cart, user, logActivity])

  return (
    <AuthContext.Provider
      value={{
        user, users, cart, orders, activityLogs, emailsSent,
        login, signup, logout, updateProfile,
        addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder,
        logActivity,
        blockUser, unblockUser, suspendUser, unsuspendUser,
        sendEmailToUser, calculateUserRiskScore, updateUserRiskScore,
        getSuspiciousUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
