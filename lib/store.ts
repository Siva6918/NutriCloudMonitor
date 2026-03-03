// HealthCart Data Store - simulates backend database for the Next.js preview
// In production MERN stack, this would be MongoDB collections

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "user" | "admin"
  weight?: number
  height?: number
  bmi?: number
  bmiCategory?: string
  createdAt: string
  blocked?: boolean
  suspended?: boolean
  suspensionReason?: string
  riskScore?: number
  lastFlaggedAt?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: "protein" | "vitamins" | "supplements" | "equipment" | "snacks"
  image: string
  rating: number
  reviews: number
  inStock: boolean
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: { productId: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "confirmed" | "delivered"
  createdAt: string
}

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: string
  riskScore?: number
}

export interface DietItem {
  name: string
  quantity: string
  calories: number
  benefit: string
  image: string
}

// Products catalog
export const products: Product[] = [
  {
    id: "p1",
    name: "Premium Whey Protein",
    description: "High-quality whey protein isolate for muscle recovery and growth. 25g protein per serving.",
    price: 49.99,
    category: "protein",
    image: "/images/products/whey-protein.jpg",
    rating: 4.8,
    reviews: 234,
    inStock: true,
  },
  {
    id: "p2",
    name: "Daily Multivitamin Complex",
    description: "Complete daily nutrition with 23 essential vitamins and minerals for optimal health.",
    price: 24.99,
    category: "vitamins",
    image: "/images/products/multivitamin.jpg",
    rating: 4.6,
    reviews: 189,
    inStock: true,
  },
  {
    id: "p3",
    name: "Omega-3 Fish Oil",
    description: "Pure omega-3 fatty acids for heart health, brain function, and joint support.",
    price: 19.99,
    category: "supplements",
    image: "/images/products/omega-3.jpg",
    rating: 4.7,
    reviews: 312,
    inStock: true,
  },
  {
    id: "p4",
    name: "Organic Green Tea Extract",
    description: "Powerful antioxidant supplement for metabolism boost and natural energy.",
    price: 15.99,
    category: "supplements",
    image: "/images/products/green-tea.jpg",
    rating: 4.5,
    reviews: 156,
    inStock: true,
  },
  {
    id: "p5",
    name: "Premium Yoga Mat",
    description: "Non-slip, eco-friendly yoga mat with alignment markings. 6mm thickness.",
    price: 39.99,
    category: "equipment",
    image: "/images/products/yoga-mat.jpg",
    rating: 4.9,
    reviews: 87,
    inStock: true,
  },
  {
    id: "p6",
    name: "Protein Energy Bars (12-Pack)",
    description: "Delicious chocolate peanut butter protein bars. 20g protein, low sugar.",
    price: 29.99,
    category: "snacks",
    image: "/images/products/protein-bars.jpg",
    rating: 4.4,
    reviews: 203,
    inStock: true,
  },
  {
    id: "p7",
    name: "Resistance Bands Set",
    description: "5-piece resistance band set with handles for full-body home workouts.",
    price: 34.99,
    category: "equipment",
    image: "/images/products/resistance-bands.jpg",
    rating: 4.6,
    reviews: 145,
    inStock: true,
  },
  {
    id: "p8",
    name: "Collagen Peptides Powder",
    description: "Premium collagen for healthy skin, hair, nails, and joint support.",
    price: 32.99,
    category: "supplements",
    image: "/images/products/collagen.jpg",
    rating: 4.7,
    reviews: 278,
    inStock: true,
  },
  {
    id: "p9",
    name: "BCAA Amino Acids",
    description: "Branched-chain amino acids for muscle recovery and endurance during workouts.",
    price: 27.99,
    category: "protein",
    image: "/images/products/bcaa.jpg",
    rating: 4.5,
    reviews: 167,
    inStock: true,
  },
  {
    id: "p10",
    name: "Premium Roasted Almonds",
    description: "Lightly salted roasted almonds. Rich in healthy fats, protein, and fiber.",
    price: 12.99,
    category: "snacks",
    image: "/images/products/almonds.jpg",
    rating: 4.8,
    reviews: 94,
    inStock: true,
  },
  {
    id: "p11",
    name: "Protein Shaker Bottle",
    description: "BPA-free 700ml shaker with mixing ball and measurement markings.",
    price: 14.99,
    category: "equipment",
    image: "/images/products/shaker-bottle.jpg",
    rating: 4.3,
    reviews: 121,
    inStock: true,
  },
  {
    id: "p12",
    name: "Vitamin D3 Sunshine",
    description: "High-potency Vitamin D3 5000IU for immune support and bone health.",
    price: 11.99,
    category: "vitamins",
    image: "/images/products/vitamin-d.jpg",
    rating: 4.6,
    reviews: 198,
    inStock: true,
  },
]

// BMI calculation and diet recommendations
export function calculateBMI(weight: number, height: number): { bmi: number; category: string } {
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)
  let category = ""
  if (bmi < 18.5) category = "Underweight"
  else if (bmi < 25) category = "Normal"
  else if (bmi < 30) category = "Overweight"
  else category = "Obese"
  return { bmi: Math.round(bmi * 10) / 10, category }
}

export function getDietPlan(category: string): DietItem[] {
  const plans: Record<string, DietItem[]> = {
    Underweight: [
      { name: "Banana Peanut Butter Smoothie", quantity: "1 large glass (400ml)", calories: 450, benefit: "High calorie, healthy fats for weight gain", image: "/images/food/banana-smoothie.jpg" },
      { name: "Whole Eggs (Boiled/Scrambled)", quantity: "3 eggs", calories: 210, benefit: "Complete protein with healthy cholesterol", image: "/images/food/boiled-eggs.jpg" },
      { name: "Brown Rice with Grilled Chicken", quantity: "1.5 cups rice + 150g chicken", calories: 550, benefit: "Complex carbs with lean protein for muscle building", image: "/images/food/chicken-rice.jpg" },
      { name: "Oatmeal with Berries & Nuts", quantity: "1 large bowl", calories: 380, benefit: "Slow-release energy with antioxidants", image: "/images/food/oatmeal.jpg" },
      { name: "Grilled Chicken Breast", quantity: "200g", calories: 330, benefit: "Lean muscle-building protein", image: "/images/food/grilled-chicken.jpg" },
      { name: "Mixed Nuts & Almonds", quantity: "1/2 cup (60g)", calories: 350, benefit: "Calorie-dense healthy fats and minerals", image: "/images/food/banana-smoothie.jpg" },
    ],
    Normal: [
      { name: "Oatmeal with Berries", quantity: "1 bowl", calories: 280, benefit: "Sustained energy with fiber and antioxidants", image: "/images/food/oatmeal.jpg" },
      { name: "Grilled Chicken / Paneer", quantity: "100g", calories: 165, benefit: "Lean protein for maintenance", image: "/images/food/grilled-chicken.jpg" },
      { name: "Fresh Green Salad", quantity: "1 large bowl", calories: 120, benefit: "Vitamins, minerals, and fiber", image: "/images/food/green-salad.jpg" },
      { name: "Brown Rice with Vegetables", quantity: "1 cup rice + veggies", calories: 320, benefit: "Balanced carbs with micronutrients", image: "/images/food/chicken-rice.jpg" },
      { name: "Grilled Fish (Salmon)", quantity: "120g", calories: 250, benefit: "Omega-3 fatty acids for heart health", image: "/images/food/grilled-fish.jpg" },
      { name: "Green Tea", quantity: "2 cups", calories: 5, benefit: "Antioxidants and metabolism support", image: "/images/food/green-tea-cup.jpg" },
    ],
    Overweight: [
      { name: "Green Salad with Lemon Dressing", quantity: "1 large bowl", calories: 80, benefit: "Low-calorie fiber-rich meal", image: "/images/food/green-salad.jpg" },
      { name: "Steamed Vegetables", quantity: "1 bowl", calories: 90, benefit: "Nutrient-dense with minimal calories", image: "/images/food/green-salad.jpg" },
      { name: "Green Tea", quantity: "3 cups daily", calories: 5, benefit: "Boosts metabolism and fat burning", image: "/images/food/green-tea-cup.jpg" },
      { name: "Grilled Fish / Lean Paneer", quantity: "80g", calories: 140, benefit: "Lean protein without excess fat", image: "/images/food/grilled-fish.jpg" },
      { name: "Oatmeal (No Sugar)", quantity: "1 small bowl", calories: 150, benefit: "Fills you up with slow-release energy", image: "/images/food/oatmeal.jpg" },
      { name: "Boiled Eggs (Whites Only)", quantity: "3 egg whites", calories: 51, benefit: "Pure protein, zero fat", image: "/images/food/boiled-eggs.jpg" },
    ],
    Obese: [
      { name: "Clear Vegetable Soup", quantity: "1 large bowl", calories: 60, benefit: "Hydrating, very low calorie, nutrient-rich", image: "/images/food/green-salad.jpg" },
      { name: "Steamed Broccoli & Spinach", quantity: "1 bowl", calories: 55, benefit: "Iron and calcium with almost no calories", image: "/images/food/green-salad.jpg" },
      { name: "Green Tea (Unsweetened)", quantity: "4 cups daily", calories: 5, benefit: "Maximum metabolism boost", image: "/images/food/green-tea-cup.jpg" },
      { name: "Grilled Fish (Small Portion)", quantity: "60g", calories: 100, benefit: "Essential protein with omega-3", image: "/images/food/grilled-fish.jpg" },
      { name: "Boiled Egg Whites", quantity: "4 egg whites", calories: 68, benefit: "Lean protein for muscle maintenance", image: "/images/food/boiled-eggs.jpg" },
      { name: "Cucumber & Carrot Sticks", quantity: "1 cup", calories: 30, benefit: "Healthy snacking with zero guilt", image: "/images/food/green-salad.jpg" },
    ],
  }
  return plans[category] || plans["Normal"]
}

// Default users (admin + demo user + suspicious users)
export const defaultUsers: User[] = [
  {
    id: "admin-1",
    name: "Admin",
    email: "admin@healthcart.com",
    password: "admin123",
    role: "admin",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "user-demo",
    name: "Demo User",
    email: "user@healthcart.com",
    password: "user123",
    role: "user",
    weight: 70,
    height: 175,
    bmi: 22.9,
    bmiCategory: "Normal",
    createdAt: "2025-02-01T14:30:00Z",
  },
  // Suspicious users with HIGH risk scores
  {
    id: "user-suspicious-1",
    name: "John Smith",
    email: "john.smith.fake@gmail.com",
    password: "password123",
    role: "user",
    createdAt: "2025-02-10T08:00:00Z",
    riskScore: 9,
    lastFlaggedAt: "2025-02-22T14:30:00Z",
  },
  {
    id: "user-suspicious-2",
    name: "Sarah Johnson",
    email: "sarah.j.2025@yahoo.com",
    password: "password123",
    role: "user",
    createdAt: "2025-02-12T10:00:00Z",
    riskScore: 8,
    lastFlaggedAt: "2025-02-22T13:45:00Z",
  },
  {
    id: "user-suspicious-3",
    name: "Mike Chen",
    email: "mike.chen.unknown@hotmail.com",
    password: "password123",
    role: "user",
    createdAt: "2025-02-08T16:20:00Z",
    riskScore: 7,
    lastFlaggedAt: "2025-02-22T12:15:00Z",
  },
  {
    id: "user-suspicious-4",
    name: "Emma Wilson",
    email: "emma.w.temp@outlook.com",
    password: "password123",
    role: "user",
    suspended: true,
    suspensionReason: "Suspicious activity",
    createdAt: "2025-02-11T09:30:00Z",
    riskScore: 6,
    lastFlaggedAt: "2025-02-21T15:00:00Z",
  },
  {
    id: "user-suspicious-5",
    name: "David Lee",
    email: "david.lee.fraud@gmail.com",
    password: "password123",
    role: "user",
    blocked: true,
    createdAt: "2025-02-09T11:45:00Z",
    riskScore: 5,
    lastFlaggedAt: "2025-02-20T10:30:00Z",
  },
]
