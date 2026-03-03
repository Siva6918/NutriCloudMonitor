"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { products } from "@/lib/store"
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface CartPageProps {
  onNavigate: (page: string) => void
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { cart, updateCartQuantity, removeFromCart, clearCart, placeOrder } = useAuth()
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)

  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    return { ...item, product }
  }).filter((item) => item.product)

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handlePlaceOrder = () => {
    const result = placeOrder()
    if (result.success) {
      setOrderSuccess(result.orderId || "")
    }
  }

  if (orderSuccess) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Order Placed Successfully!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your order #{orderSuccess} has been confirmed and will be processed shortly.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => { setOrderSuccess(null); onNavigate("products"); }}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => { setOrderSuccess(null); onNavigate("dashboard"); }}
            className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h2 className="text-xl font-bold text-foreground">Your Cart is Empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse our products and add items to your cart.
        </p>
        <button
          onClick={() => onNavigate("products")}
          className="mt-5 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Package className="h-4 w-4" />
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          Clear Cart
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Cart items */}
        <div className="flex-1 space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={item.product!.image}
                  alt={item.product!.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{item.product!.name}</h3>
                <p className="text-sm font-medium text-primary">${item.product!.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted text-foreground transition-colors hover:bg-muted/80"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted text-foreground transition-colors hover:bg-muted/80"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold text-card-foreground">
                  ${(item.product!.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-80">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-card-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-card-foreground">
                  {shipping === 0 ? (
                    <span className="text-primary">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-medium text-card-foreground">${tax.toFixed(2)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-card-foreground">Total</span>
                  <span className="text-base font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Place Order <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onNavigate("products")}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
            >
              <ShoppingCart className="h-4 w-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
