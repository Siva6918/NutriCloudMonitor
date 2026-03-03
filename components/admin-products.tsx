'use client'

import { Package, Plus, Edit2, Trash2, Filter } from 'lucide-react'
import { useState } from 'react'

export function AdminProducts() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Whey Protein', category: 'Supplements', price: 45, stock: 120, sales: 342 },
    { id: 2, name: 'Multivitamin', category: 'Vitamins', price: 25, stock: 85, sales: 287 },
    { id: 3, name: 'Omega-3', category: 'Supplements', price: 35, stock: 64, sales: 156 },
    { id: 4, name: 'Green Tea', category: 'Supplements', price: 20, stock: 200, sales: 423 },
    { id: 5, name: 'Yoga Mat', category: 'Equipment', price: 30, stock: 45, sales: 98 },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Management</h1>
          <p className="text-sm text-slate-400">Manage health products and inventory</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-white font-medium transition">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 text-left font-medium text-slate-300">Product</th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">Category</th>
              <th className="px-4 py-3 text-right font-medium text-slate-300">Price</th>
              <th className="px-4 py-3 text-center font-medium text-slate-300">Stock</th>
              <th className="px-4 py-3 text-right font-medium text-slate-300">Sales</th>
              <th className="px-4 py-3 text-center font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                <td className="px-4 py-3 text-slate-300 font-medium">{product.name}</td>
                <td className="px-4 py-3 text-slate-400">{product.category}</td>
                <td className="px-4 py-3 text-right text-slate-300 font-mono">${product.price}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${product.stock > 100 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-slate-300">{product.sales}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1 hover:bg-slate-800 rounded transition"><Edit2 className="h-4 w-4 text-slate-400" /></button>
                    <button className="p-1 hover:bg-slate-800 rounded transition"><Trash2 className="h-4 w-4 text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
