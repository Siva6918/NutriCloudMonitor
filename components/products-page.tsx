"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { products } from "@/lib/store"
import { Search, Filter, Star, ShoppingCart, Plus, Check, X } from "lucide-react"
import Image from "next/image"

const categories = [
  { id: "all", label: "All Products" },
  { id: "protein", label: "Protein" },
  { id: "vitamins", label: "Vitamins" },
  { id: "supplements", label: "Supplements" },
  { id: "equipment", label: "Equipment" },
  { id: "snacks", label: "Snacks" },
]

export function ProductsPage() {
  const { addToCart, cart, logActivity } = useAuth()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === "all" || p.category === category
      return matchSearch && matchCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price
        case "price-high": return b.price - a.price
        case "rating": return b.rating - a.rating
        default: return a.name.localeCompare(b.name)
      }
    })

  const handleAddToCart = (productId: string) => {
    addToCart(productId)
    setAddedIds((prev) => new Set([...prev, productId]))
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }, 1500)
  }

  const getCartQuantity = (productId: string) => {
    return cart.find((item) => item.productId === productId)?.quantity || 0
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Health Products</h1>
        <p className="text-sm text-muted-foreground">Browse premium supplements, vitamins, equipment, and healthy snacks.</p>
      </div>

      {/* Filters row */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search bar */}
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-card-foreground hover:bg-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        {category !== "all" ? ` in ${categories.find((c) => c.id === category)?.label}` : ""}
        {search ? ` matching "${search}"` : ""}
      </p>

      {/* Products grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => {
            const inCart = getCartQuantity(product.id)
            const justAdded = addedIds.has(product.id)
            return (
              <div key={product.id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg">
                <div className="relative h-48 overflow-hidden bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {/* Category badge */}
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground capitalize">
                    {product.category}
                  </span>
                  {inCart > 0 && (
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
                      <ShoppingCart className="h-3 w-3" />
                      {inCart}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-card-foreground">{product.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? "text-[hsl(46,97%,55%)]" : "text-muted"}`}
                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                      />
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price + Add to cart */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        justAdded
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <Check className="h-4 w-4" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">No products found</h3>
          <p className="text-sm text-muted-foreground">Try a different search or category.</p>
        </div>
      )}
    </div>
  )
}
