@echo off
echo 🚀 HealthCart MERN Setup Script
echo ================================
echo.
echo 📦 Installing Backend Dependencies...
cd backend
call npm install

echo.
echo 📦 Installing Frontend Dependencies...
cd ..\frontend
call npm install

echo.
echo ✅ Setup Complete!
echo.
echo 📝 Next Steps:
echo 1. Make sure MongoDB is running
echo.
echo 2. Start Backend (open new terminal):
echo    cd backend
echo    npm start
echo.
echo 3. Start Frontend (open another terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 4. Seed Database (optional):
echo    cd backend
echo    node seeds/seedProducts.js
echo    node seeds/seedAdmin.js
echo.
echo 🌐 Access URLs:
echo    User: http://localhost:3000
echo    Admin: http://localhost:3000/admin/login
echo.
echo 🔐 Admin Credentials:
echo    Email: admin@healthcart.com
echo    Password: admin123
pause
