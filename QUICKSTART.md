# Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Clone & Install Backend
```bash
cd backend
npm install
```

### Step 2: Setup MongoDB
Create a `.env` file in the backend folder:
```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/healthcart
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

Get MongoDB free at: https://www.mongodb.com/cloud/atlas

### Step 3: Start Backend
```bash
npm run dev
```

You should see: `Server running on port 5000`

### Step 4: Install Frontend
Open a new terminal:
```bash
cd frontend
npm install
```

### Step 5: Start Frontend
```bash
npm run dev
```

You should see: Local: http://localhost:3000

### Step 6: Access Application
Open http://localhost:3000 in your browser

### Step 7: Sign Up & Explore
- Create an account
- Calculate your BMI
- Browse health products
- Add items to cart

## Demo Credentials (After Seeding)
- Email: user@test.com
- Password: password123

## Seed Sample Products
Optional - Seeds 12 health products to your database:
```bash
cd backend
node seeds/seedProducts.js
```

## Common Issues

### Port 5000/3000 Already in Use
Change port in:
- Backend: `backend/.env` (PORT=5001)
- Frontend: `frontend/vite.config.js` (port: 3001)

### MongoDB Connection Error
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure internet connection

### CORS Error
- Backend must be running on port 5000
- Check `.env` configuration

## Project Structure

```
HealthCart/
├── backend/          → Node.js API server
│   ├── models/       → Database schemas
│   ├── routes/       → API endpoints
│   └── controllers/  → Business logic
└── frontend/         → React application
    ├── components/   → UI components
    ├── context/      → State management
    └── services/     → API calls
```

## Features Overview

✅ User Authentication (JWT)
✅ BMI Calculator
✅ Diet Recommendations
✅ Product Catalog
✅ Shopping Cart
✅ Checkout Process
✅ Order Management
✅ Responsive Design
✅ Activity Logging

## Next Steps

1. Explore the Dashboard
2. Calculate your BMI
3. View personalized diet plan
4. Browse health products
5. Add items to cart
6. Checkout with shipping address

## Need Help?

- Check the main README.md for detailed documentation
- Review console logs for errors
- Check Network tab in browser DevTools
- Verify all environment variables are set

Happy Shopping! 🚀
