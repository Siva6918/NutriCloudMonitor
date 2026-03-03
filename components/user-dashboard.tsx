"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, ShoppingCart, Activity } from "lucide-react"

export function UserDashboard() {
  const { user, logout } = useAuth()
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState("")
  const [dietPlan, setDietPlan] = useState<any[]>([])

  const calculateBMI = () => {
    if (!weight || !height) {
      alert("Please enter both weight and height")
      return
    }

    const heightInMeters = parseFloat(height) / 100
    const calculatedBMI = parseFloat(weight) / (heightInMeters * heightInMeters)
    setBmi(Math.round(calculatedBMI * 10) / 10)

    let category = ""
    let plan = []

    if (calculatedBMI < 18.5) {
      category = "Underweight"
      plan = [
        {
          id: 1,
          name: "Peanut Butter Sandwich",
          quantity: "2",
          calories: "500",
          benefits: "High protein and calories",
          image: "/images/food/banana-smoothie.jpg",
        },
        {
          id: 2,
          name: "Banana Smoothie",
          quantity: "1 glass",
          calories: "300",
          benefits: "Rich in potassium",
          image: "/images/food/banana-smoothie.jpg",
        },
        {
          id: 3,
          name: "Boiled Eggs",
          quantity: "2-3",
          calories: "280",
          benefits: "Complete protein",
          image: "/images/food/boiled-eggs.jpg",
        },
        {
          id: 4,
          name: "Brown Rice",
          quantity: "1.5 cups",
          calories: "400",
          benefits: "Complex carbs",
          image: "/images/food/chicken-rice.jpg",
        },
        {
          id: 5,
          name: "Chicken Breast",
          quantity: "150g",
          calories: "250",
          benefits: "Lean protein",
          image: "/images/food/grilled-chicken.jpg",
        },
        {
          id: 6,
          name: "Almonds",
          quantity: "handful",
          calories: "180",
          benefits: "Healthy fats",
          image: "/images/food/banana-smoothie.jpg",
        },
      ]
    } else if (calculatedBMI < 25) {
      category = "Normal"
      plan = [
        {
          id: 1,
          name: "Oatmeal",
          quantity: "1 bowl",
          calories: "150",
          benefits: "Fiber rich",
          image: "/images/food/oatmeal.jpg",
        },
        {
          id: 2,
          name: "Grilled Chicken",
          quantity: "100g",
          calories: "165",
          benefits: "Lean protein",
          image: "/images/food/grilled-chicken.jpg",
        },
        {
          id: 3,
          name: "Fresh Apple",
          quantity: "1",
          calories: "95",
          benefits: "Antioxidants",
          image: "/images/food/banana-smoothie.jpg",
        },
        {
          id: 4,
          name: "Vegetable Soup",
          quantity: "1 bowl",
          calories: "120",
          benefits: "Nutrient dense",
          image: "/images/food/green-salad.jpg",
        },
        {
          id: 5,
          name: "Brown Rice",
          quantity: "1 cup",
          calories: "270",
          benefits: "Balanced carbs",
          image: "/images/food/chicken-rice.jpg",
        },
        {
          id: 6,
          name: "Grilled Fish",
          quantity: "100g",
          calories: "150",
          benefits: "Omega-3 rich",
          image: "/images/food/grilled-fish.jpg",
        },
      ]
    } else if (calculatedBMI < 30) {
      category = "Overweight"
      plan = [
        {
          id: 1,
          name: "Green Salad",
          quantity: "1 bowl",
          calories: "100",
          benefits: "Low calorie",
          image: "/images/food/green-salad.jpg",
        },
        {
          id: 2,
          name: "Grilled Fish",
          quantity: "80g",
          calories: "120",
          benefits: "Omega-3 rich",
          image: "/images/food/grilled-fish.jpg",
        },
        {
          id: 3,
          name: "Green Tea",
          quantity: "1 cup",
          calories: "2",
          benefits: "Metabolism boost",
          image: "/images/food/green-tea-cup.jpg",
        },
        {
          id: 4,
          name: "Steamed Broccoli",
          quantity: "150g",
          calories: "50",
          benefits: "Very low calorie",
          image: "/images/food/green-salad.jpg",
        },
        {
          id: 5,
          name: "Boiled Eggs",
          quantity: "1-2",
          calories: "140",
          benefits: "Protein",
          image: "/images/food/boiled-eggs.jpg",
        },
        {
          id: 6,
          name: "Oatmeal",
          quantity: "0.5 bowl",
          calories: "75",
          benefits: "Fiber",
          image: "/images/food/oatmeal.jpg",
        },
      ]
    } else {
      category = "Obese"
      plan = [
        {
          id: 1,
          name: "Vegetable Soup",
          quantity: "1 bowl",
          calories: "80",
          benefits: "Nutrient dense",
          image: "/images/food/green-salad.jpg",
        },
        {
          id: 2,
          name: "Steamed Vegetables",
          quantity: "200g",
          calories: "60",
          benefits: "Very low calorie",
          image: "/images/food/green-salad.jpg",
        },
        {
          id: 3,
          name: "Green Tea",
          quantity: "2 cups",
          calories: "4",
          benefits: "Fat burning",
          image: "/images/food/green-tea-cup.jpg",
        },
        {
          id: 4,
          name: "Grilled Fish",
          quantity: "60g",
          calories: "90",
          benefits: "Low fat protein",
          image: "/images/food/grilled-fish.jpg",
        },
        {
          id: 5,
          name: "Salad with Lemon",
          quantity: "1 large",
          calories: "50",
          benefits: "Low calorie",
          image: "/images/food/green-salad.jpg",
        },
        {
          id: 6,
          name: "Water",
          quantity: "8 glasses",
          calories: "0",
          benefits: "Hydration",
          image: "/images/food/green-tea-cup.jpg",
        },
      ]
    }

    setBmiCategory(category)
    setDietPlan(plan)
  }

  const getBMIColor = () => {
    if (!bmi) return "text-muted-foreground"
    if (bmi < 18.5) return "text-blue-500"
    if (bmi < 25) return "text-green-500"
    if (bmi < 30) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name}!</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* BMI Calculator Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-foreground">BMI Calculator & Personalized Diet Plan</h2>
          <Card className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-sm font-medium text-foreground">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter height"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">BMI</label>
                <div className={`mt-2 rounded-lg border border-input bg-muted px-3 py-2 text-center font-bold ${getBMIColor()}`}>
                  {bmi ? `${bmi}` : "-"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Category</label>
                <div className="mt-2 rounded-lg border border-input bg-muted px-3 py-2 text-center font-medium text-foreground">
                  {bmiCategory || "-"}
                </div>
              </div>
            </div>
            <Button onClick={calculateBMI} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Calculate BMI & Get Diet Plan
            </Button>
          </Card>
        </div>

        {/* Diet Plan Section */}
        {dietPlan.length > 0 && (
          <div>
            <h2 className="mb-6 text-xl font-bold text-foreground">
              Your Personalized {bmiCategory} Diet Plan
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dietPlan.map((item) => (
                <Card key={item.id} className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative h-40 overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    <p className="text-sm text-muted-foreground">Calories: {item.calories}</p>
                    <p className="mt-2 text-sm text-primary font-medium">{item.benefits}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
