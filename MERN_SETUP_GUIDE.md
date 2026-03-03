# Complete MERN Setup & Error Fix Guide

## FASTEST FIX - Start Fresh with Clean Structure

If you're getting persistent import errors, follow this approach to start clean:

### Option 1: Use the Latest Downloaded Files

1. **Download the latest project from v0** (this has all fixes)
2. **Delete your current `frontend` folder completely**
3. **Download and extract the new version**
4. **Only use the `backend` and `frontend` folders from the new download**

### Option 2: Manual Quick Fix (If you want to keep your current setup)

If the files exist but you're still getting errors, it's likely a **caching issue**:

**Do this in VS Code Terminal:**
```bash
# In frontend folder
cd frontend

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache (if using Next.js)
rm -rf .next

# Restart dev server
npm run dev
```

**On Windows PowerShell:**
```powershell
cd frontend
rm -r node_modules -ErrorAction SilentlyContinue
rm package-lock.json -ErrorAction SilentlyContinue
npm install
npm run dev
```

### Option 3: Check if You're Using the Correct Backend

Make sure your backend is running:

```bash
# Terminal 1 - Start Backend
cd backend
npm install  # only needed once
npm start

# Should show: "Server running on port 5000"
```

**Then in a new terminal:**
```bash
# Terminal 2 - Start Frontend
cd frontend
npm run dev

# Should show: "ready on http://localhost:3000"
```

---

## If You Still Get Errors

Please share the **exact error message** and I'll provide a targeted fix.

Common errors and solutions:

| Error | Solution |
|-------|----------|
| `Module not found: AuthContext` | Make sure `src/context/AuthContext.jsx` exists |
| `Cannot find module 'api'` | Make sure `src/services/api.js` exists |
| `PORT already in use` | Change port in `.env` or kill process using port |
| `ECONNREFUSED` (Backend not running) | Start backend first with `npm start` in backend folder |
| `Unexpected token` | Copy-paste might have formatting issues, retype the file |

---

## Verified Working Credentials

**User Login:**
- Email: `user@healthcart.com`
- Password: `user123`

**Admin Login:**
- Email: `admin@healthcart.com`
- Password: `admin123`

---

## File Structure (What should exist)

```
project/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── middleware/
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx ✓
│   │   │   └── AdminAuthContext.jsx ✓
│   │   ├── services/
│   │   │   └── api.js ✓
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

---

## Last Resort: Complete Fresh Install

If nothing works:

1. **Delete the entire project folder**
2. **Download fresh from v0** (Click the three dots → Download ZIP)
3. **Extract and follow the QUICKSTART.md in the README**
4. **Run the setup.sh or setup.bat**

This will ensure all files are correctly in place with no conflicts.
