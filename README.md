<div align="center">

# 🚀 CLOUD-BASED WEB APPLICATION  
# 🛡 BEHAVIOR MONITORING SYSTEM  

### ⚡ Real-Time Behavioral Intelligence Platform  
### 🔐 Built with MERN Stack  
### ☁ Cloud Native • Scalable • Secure  

</div>

---

## 🌌 SYSTEM VISION

A next-generation behavioral intelligence system designed to monitor, analyze, and detect abnormal user activity in real time.

This platform transforms traditional web applications into intelligent, self-aware systems capable of detecting suspicious navigation patterns, rapid clickstreams, and anomalous login behavior through dynamic risk scoring and live monitoring dashboards.

---

## 🧠 CORE CONCEPT

Every user interaction leaves a behavioral footprint.

This system captures:

• Clickstreams  
• Session sequences  
• Login patterns  
• Navigation flow  
• Interaction frequency  

Then converts them into:

→ Structured session logs  
→ Risk scores  
→ Actionable alerts  

---

## 🏗 ARCHITECTURE MATRIX

    👤 User Browser
          ↓
    ⚛ React Frontend
          ↓
    🧩 Express API Layer
          ↓
    ⚙ Node.js Engine
          ↓
    🗄 MongoDB Cloud Storage
          ↓
    🛡 Admin Intelligence Dashboard

---

## 👤 USER ENVIRONMENT

When a user logs in:

✔ Session is created  
✔ IP address captured  
✔ Device info recorded  
✔ Clickstream tracking activated  
✔ Background risk analysis started  

User Dashboard Includes:

- Profile
- Activity history
- Platform features (Ecommerce-style UI)
- Normal browsing interface

Monitoring runs silently in the background.

Users cannot:

✖ View system logs  
✖ Access monitoring analytics  
✖ View risk scores  
✖ Access admin routes  

---

## 🛡 ADMIN CONTROL CENTER

Admin login unlocks:

📊 Live Active Users  
📈 Behavioral Analytics  
⚠ Suspicious Session Alerts  
🧾 Clickstream Timeline View  
🚫 User Blocking System  
📍 IP Tracking  

Admin Dashboard Features:

- Real-time monitoring panel
- Risk score visualization
- Session activity breakdown
- Alert management system

---

## 🔐 ROLE-BASED ACCESS CONTROL

Each user document contains:

{
  name: "User",
  email: "user@email.com",
  password: "hashed_password",
  role: "user" or "admin"
}

System Logic:

If role = user  
→ Redirect to User Dashboard  

If role = admin  
→ Redirect to Admin Control Center  

Backend middleware strictly enforces permissions.

---

## 📊 RISK ENGINE

Risk Score Calculation Model:

Risk Score =
(Login Anomaly Weight)
+ (Click Frequency Weight)
+ (Unusual Navigation Weight)
+ (Session Duration Deviation)

If score exceeds threshold:

🚨 Session marked suspicious  
📢 Admin notified  
📍 Alert logged  

---

## 🗄 DATABASE STRUCTURE

Collections:

• Users  
• Sessions  
• ActivityLogs  
• RiskScores  
• AdminActions  

Example Session Document:

{
  userId: "12345",
  loginTime: "2026-02-15T10:20:30Z",
  ipAddress: "192.168.1.10",
  actions: [
    { page: "/home", timestamp: "..." },
    { page: "/profile", timestamp: "..." }
  ]
}

---

## ⚙ INSTALLATION SEQUENCE

1️⃣ Clone Repository

git clone https://github.com/Siva6918/NutriCloudMonitor.git

2️⃣ Install Backend

cd backend  
npm install  

3️⃣ Install Frontend

cd frontend  
npm install  

4️⃣ Configure Environment Variables (.env)

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

5️⃣ Start Backend

npm start  

6️⃣ Start Frontend

npm start  

---

## ☁ DEPLOYMENT STACK

Frontend → Vercel  
Backend → Render / AWS  
Database → MongoDB Atlas  

Security Measures:

✔ HTTPS enabled  
✔ Environment variables secured  
✔ Role-based API protection  
✔ JWT authentication  

---

## 🧪 TEST SCENARIOS

🟢 Normal User  
Slow navigation  
Low risk score  
No alert  

🟠 Suspicious Behavior  
Rapid page switching  
Unusual login location  
High risk score  
Alert triggered  

🔴 Admin Intervention  
Investigate session  
Block user  
Log action  

---

## 🔮 FUTURE EVOLUTION

• AI-based anomaly detection (LSTM integration)  
• WebSocket real-time alerts  
• Geo-location risk analysis  
• Device fingerprinting  
• Behavior clustering algorithms  

---

# Admin Features

---

## Suspicious Users Management - Admin Features

**Location**: Admin Dashboard → Sidebar → "Suspicious Users" (with red badge showing count)

### Sample Suspicious Users Available for Testing:

#### 1. **John Smith** ⚠️ CRITICAL RISK (Score: 9)
- **Email**: john.smith.fake@gmail.com
- **Risk Indicators**: 
  - 3 failed login attempts
  - 2 rapid checkouts ($450 + $320) within 2 minutes
- **Available Actions**: Block, Suspend, Send Email

#### 2. **Sarah Johnson** ⚠️ HIGH RISK (Score: 8)
- **Email**: sarah.j.2025@yahoo.com
- **Risk Indicators**:
  - Viewed 4+ products rapidly
  - Added multiple items to cart
  - Rapid checkout ($280)
- **Available Actions**: Block, Suspend, Send Email

#### 3. **Mike Chen** ⚠️ HIGH RISK (Score: 7)
- **Email**: mike.chen.unknown@hotmail.com
- **Risk Indicators**:
  - 2 failed login attempts
  - Multiple product views and cart additions
- **Available Actions**: Block, Suspend, Send Email

#### 4. **Emma Wilson** 🔶 MEDIUM RISK (Score: 6)
- **Email**: emma.w.temp@outlook.com
- **Status**: Already Suspended
- **Suspension Reason**: Suspicious activity
- **Risk Indicators**: Large order ($650), unusual login location
- **Available Actions**: Unsuspend, Send Email

#### 5. **David Lee** 🔴 MEDIUM RISK (Score: 5)
- **Email**: david.lee.fraud@gmail.com
- **Status**: Already Blocked
- **Risk Indicators**: Multiple failed login attempts, unauthorized transaction attempt
- **Available Actions**: Unblock, Send Email

---

## Features You Can Test:

### 1. **BLOCK USERS** (Red Button)
- Prevents user from accessing their account
- Confirmation dialog appears
- User status changes to "Blocked"
- Unblock button replaces Block button once blocked

### 2. **SUSPEND USERS** (Orange Button)
- Temporarily disable account
- Choose from predefined reasons:
  - Suspicious activity
  - Unusual pattern
  - Payment issue
  - Fraud indicator
  - Policy violation
  - Custom reason (text input)
- User status changes to "Suspended"
- Unsuspend button replaces Suspend button when suspended

### 3. **SEND EMAILS** (Blue Button)
- Send security notifications with 3 templates:
  - **Security Alert**: "We've detected unusual activity on your account..."
  - **Account Status**: "Your account status has been updated due to security concerns..."
  - **Action Required**: "For your account security, please verify your identity..."
- Edit message before sending
- Emails are tracked in the system

---

## Summary Dashboard:
- **Total Suspicious**: 5 users with high risk scores
- **Suspended**: 1 (Emma Wilson)
- **Blocked**: 1 (David Lee)

## Risk Score Color Legend:
- 🟩 **0-2**: Low Risk (Green)
- 🟨 **3-5**: Medium Risk (Yellow)
- 🟧 **6-7**: High Risk (Orange)
- 🟥 **8-10**: Critical Risk (Red)

---

# ADMIN GUIDE

---

# Administrator & SOC Guide: NutriCloudMonitor

This document serves as an **end-to-end technical guide** for the Administrator Dashboard and the underlying Security Operations Center (SOC) architecture. It is written for reviewers and developers to understand exactly how the monitoring algorithms work, the mathematical formulas used, where each file resides in the stack, and how data physically travels from a user's click to the Admin's screen.

---

## 1. High-Level System Architecture

The NutriCloudMonitor acts simultaneously as a health application for users and a stealth behavioral tracking system for administrators.

1. **The Sensor (Frontend)**: As a user interacts with the app (clicking pages, calculating BMI, logging in, adding items to the cart), background components silently capture these actions.
2. **The Ingestion Layer (Backend API)**: The Express.js server receives these interactions in real-time and normalizes them.
3. **The Data Store (MongoDB)**: Interactions are stored immutably in the `ActivityLog` collection.
4. **The Intelligence Engine (Controllers)**: Before sending data to the Admin Dashboard, the backend runs complex MongoDB Aggregation pipelines and mathematical formulas across thousands of logs to detect anomalies, rank risk, and evaluate probabilities.
5. **The Control Center (Admin UI)**: The React dashboard visually maps the detected behavioral anomalies (Graphs, Heatmaps, Sankey Clickstreams) and allows the Admin to proactively Block or Suspend bad actors.

---

## 2. End-to-End File Explanations

Here is every file involved in the Administrator and Monitoring flow, from Frontend to Backend.

### Frontend Components (The Admin View)
**Location:** `frontend/src/components/Admin/`

* `AdminDashboard.jsx`  
  **Purpose:** The central layout component for the Admin platform. It fetches all security statistics, activities, clickstream matrices, and user data on load, then passes them down to the various visual sub-components.

* `components/Overview/ActivityGraph.jsx` & `RiskDistribution.jsx`  
  **Purpose:** Visualizes user activity over the past 24 hours and categorizes the user base into mathematical risk bands: **Low Risk**, **Medium Risk** (Suspicious), and **High Risk**.

* `components/Overview/ClickstreamAnalysis.jsx`  
  **Purpose:** Renders the complex **Markov Transition Matrix** using a Recharts Sankey Diagram. It visually maps the flow of user traffic from one page (Source) to another (Target), highlighting standard paths vs anomalous bypassers.

* `components/SecurityLogTable.jsx`  
  **Purpose:** A chronological feed of raw `ActivityLog` data. It acts as the "Forensic Audit Trail".

### The Tracking Sensors (User Frontend)
**Location:** `frontend/src/components/`

* `RouteTracker.jsx`  
  **Purpose:** This component secretly wraps the entire React app using the `useLocation()` hook. Every time the URL changes, it captures the previous page (`source`) and the new page (`target`), and instantly performs an API `POST` to `/api/analytics/track`.

### Backend Routing & Logic
**Location:** `backend/`

* `routes/admin.js`  
  **Purpose:** Defines the protected`/api/admin/*` endpoints, enforcing `isAdmin: true` middleware.
* `models/ActivityLog.js`  
  **Purpose:** The MongoDB Schema definition for every behavioral action (e.g., `PAGE_TRANSITION`, `login_failed`).
* `controllers/adminController.js`  
  **Purpose:** The **core intelligence engine** of the system where the algorithms and aggregations are executed.

---

## 3. The Algorithms & Mathematical Formulas

The SOC utilizes two primary methods to detect bad actors: deterministic behavioral thresholds and probabilistic clickstream engines.

### A. Dynamic User Risk Score Algorithm
This algorithm determines how "dangerous" a specific user session is based on their historical and immediate authentication friction.

**File Location:** `backend/utils/calculateRiskScore.js`

**The Code Snippet & Formula:**
```javascript
export const calculateRiskScoreAndStatus = (failedAttempts, totalFailedAttempts) => {
    // Formula calculation
    let riskScore = (failedAttempts * 3) + (totalFailedAttempts > 10 ? 2 : 0);

    // Status classification logic
    let systemStatus = 'Safe';
    if (riskScore >= 3 && riskScore <= 5) {
        systemStatus = 'Suspicious';
    } else if (riskScore > 5) {
        systemStatus = 'HighRisk';
    }

    return { riskScore, systemStatus };
};
```

**How It Works (Explanation):**
- **Immediate Penalty (`failedAttempts * 3`):** Every current failed login attempt heavily penalizes the user by increasing the score by 3.
- **Historical Penalty (`totalFailedAttempts > 10 ? 2 : 0`):** If a user has a historical lifetime total of more than 10 failed attempts across *all* sessions, they receive a permanent baseline penalty of +2, marking their identity as historically untrustworthy.

**Real-world execution:** 
If a user fails to login twice today (`failedAttempts = 2`) but has no historical failures (`totalFailedAttempts = 2`), their score is `(2 * 3) + 0 = 6`. They are classified as **HighRisk**. If they successfully login, their immediate `failedAttempts` resets to 0, dynamically lowering their score and status.

### B. Markov Transition Matrix Probability Algorithm
This engine detects "impossible" or "highly abnormal" page navigation patterns—classic symptoms of automated bots or API scraping. It models user navigation as a Markov Chain.

**File Location:** `backend/controllers/adminController.js` (Export: `getClickstreamMatrix`)

**The Code Snippet & Formula:**
```javascript
// Step 3: Build Statistical Matrix with Probabilities
const matrix = transitions.map(t => {
  const source = t._id.source;
  const target = t._id.target;
  const count = t.count;
  
  // Mathematical Formula: P(Target | Source)
  const probability = sourceTotals[source] > 0 ? (count / sourceTotals[source]) : 0;

  return {
    source, target, value: count,
    probability: Math.round(probability * 1000) / 1000
  };
});

// Step 4: Split Normal vs Anomalous Flows
matrix.forEach(edge => {
  // Flag as Anomalous if Probability < 5% AND Source has significant traffic (>= 5)
  if (edge.probability < 0.05 && sourceTotals[edge.source] >= 5) {
    anomalousFlow.push(edge);
  } else {
    normalFlow.push(edge);
  }
});
```

**How It Works (Explanation):**
1. **The Formula:** `P(Target | Source) = P(Source -> Target) / Total Traffic Originating from Source`. It calculates the exact probability decimal (e.g., `0.85` means 85% of users go from Home to the Products page).
2. **The Algorithm Logic:** The system iterates through all recorded behavioral "edges" (page-to-page transitions). 
3. **Anomaly Detection:** An edge is flagged as an **Anomaly** if two conditions are met:
   - The probability of a human taking this path is less than 5% (`probability < 0.05`).
   - To prevent false positives on brand-new pages with low traffic, the source page must have at least 5 recorded outgoing events (`sourceTotals >= 5`).

**Real-world execution:** 
If 100 users visit the "Home" page, and only 1 user uses a script to forcefully jump straight to a protected "Checkout" endpoint without opening the Cart, the engine calculates the probability as `1 / 100 = 0.01` (1%). Since `0.01 < 0.05` and `100 >= 5`, the dashboard instantly visualizes this path as anomalous hacker behavior.

### C. Deterministic Behavioral Activity Anomalies
Beyond probabilistic math, the system actively queries the database for hard thresholds that indicate brute-forcing or fraudulent transaction stuffing using MongoDB `$aggregate` pipelines.

**File Location:** `backend/controllers/adminController.js` (Export: `getAnomalousActivities`)

**1. Login Brute Force Algorithm Snippet:**
```javascript
const suspiciousUsers = await ActivityLog.aggregate([
  { $match: { action: 'login' } },
  { $group: { _id: '$userId', loginCount: { $sum: 1 }, lastLogin: { $max: '$createdAt' } } },
  { $match: { loginCount: { $gt: 10 } } }, // Threshold Algorithm: > 10 attempts
  { $limit: 10 }
]);
```
- **Explanation:** The database groups all login attempts by user ID and counts them. If the count exceeds the rigid `10` threshold, the user is flagged for Suspicious Login Activity.

**2. Rapid Checkout Spikes (Purchase Anomalies) Snippet:**
```javascript
const rapidCheckouts = await ActivityLog.aggregate([
  { $match: { action: 'checkout' } },
  { $group: { _id: '$userId', checkoutCount: { $sum: 1 }, maxTime: { $max: '$createdAt' }, minTime: { $min: '$createdAt' } } },
  { $project: { checkoutCount: 1, timeSpan: { $subtract: ['$maxTime', '$minTime'] } } },
  { $match: { checkoutCount: { $gt: 5 }, timeSpan: { $lt: 3600000 } } } // Faster than 5 checkouts per hour
]);
```
- **Explanation:** The database calculates the time delta (`timeSpan`) between a user's *first* recorded checkout and their *last* checkout. If they have completed more than 5 checkouts (`checkoutCount > 5`) within 3,600,000 milliseconds (1 hour), the algorithm detects an anomaly, recognizing that a normal human cannot realistically complete 6 distinct e-commerce checkouts in 60 minutes.

---

## 4. Admin Proactive System Governance

Once the algorithms detect anomalies and the Dashboard visualizes them, the Admin has direct control over the platform's safety.

**File Location:** `backend/controllers/adminController.js` (Export: `updateUserAdminStatus`)

```javascript
// Admin overriding a user's system permissions
user.adminStatus = adminStatus; // 'Suspended' or 'Blocked'
await user.save();
```

If an Admin reviews a user's forensic logged clickstream and confirms they are a bad actor, they can alter the user's `adminStatus`.
- **Active:** Normal operation.
- **Suspended:** The user can log in but is blocked from specific data-modifying endpoints.
- **Blocked:** API middleware evaluates this status globally and rejects all requests with a `403 Forbidden`, completely severing the bad actor from the system.

---

# Backend Architecture & Code Guide: NutriCloudMonitor

---

This document provides an end-to-end technical explanation of the **Backend** architecture for NutriCloudMonitor. It is designed for developers and reviewers to understand how the Express.js server is structured, how data flows through the controllers, and exactly where the core business and security logic resides.

---

## 1. High-Level Folder Structure

The Node.js backend follows a standard MVC (Model-View-Controller) pattern, separated into well-defined layers:

```text
backend/
├── config/         # Database connection and environment setups
├── controllers/    # Core business logic and algorithmic engines
├── middleware/     # Request interceptors (Auth, Admin verification)
├── models/         # MongoDB Mongoose schemas
├── routes/         # API endpoint definitions mapping to controllers
├── seeds/          # Scripts to populate initial mock/admin data
├── utils/          # Shared helper functions (e.g., Risk Score math)
└── server.js       # The main application entry point
```

---

## 2. The Entry Point: `server.js`

**Location:** `backend/server.js`

This file is the backbone of the Express application. It initializes the server, binds all the middleware (like CORS and JSON parsers), connects to the database via Mongoose, and registers every API route.

**Key Code Snippet (Route Registration):**
```javascript
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import analyticsRoutes from './routes/analytics.js';

// ... middleware setup ...

// API Route Registration
app.use('/api/auth', authRoutes);         // User login/signup
app.use('/api/admin', adminRoutes);       // Protected admin intelligence
app.use('/api/analytics', analyticsRoutes); // Silently receives clickstreams
```
*Why this matters:* This shows the strict separation of concerns. Standard users interact with `/api/auth` or `/api/products`, while the frontend's background sensors constantly ping `/api/analytics` without the user knowing.

---

## 3. Data Integrity: The Models

**Location:** `backend/models/`

Models define the strict structure of the NoSQL MongoDB documents using Mongoose.

### A. The User Model (`User.js`)
Stores health data alongside critical security flags.

**Key Features Snippet:**
```javascript
failedLoginAttempts: { type: Number, default: 0 },
totalFailedAttempts: { type: Number, default: 0 },
lockUntil: { type: Date },
systemStatus: {
  type: String,
  enum: ['Safe', 'Suspicious', 'HighRisk'],
  default: 'Safe'
},
adminStatus: {
  type: String,
  enum: ['Active', 'Suspended', 'Blocked'],
  default: 'Active'
}
```
*Why this matters:* The `systemStatus` is dynamically calculated by algorithms based on the `failedAttempts` integers. The `adminStatus` acts as a hard manual override (Kill Switch) managed by the system administrator. 

### B. The ActivityLog Model (`ActivityLog.js`)
The forensic heartbeat of the application. Everything a user does creates a document here.

**Key Features Snippet:**
```javascript
action: {
  type: String,
  required: true,
  enum: ['LOGIN_SUCCESS', 'PAGE_TRANSITION', 'MULTIPLE_FAILED_ATTEMPTS', 'checkout', /* ... */]
},
details: { type: mongoose.Schema.Types.Mixed, default: {} },
ipAddress: { type: String },
```

---

## 4. The Intelligence Engines: Controllers

**Location:** `backend/controllers/`

Controllers contain the actual raw NodeJS JavaScript logic that executes when an endpoint is hit.

### A. The Authentication Controller (`authController.js`)
Handles login/signup, but crucially, it calculates the Risk Score dynamically every time a user gets their password wrong.

**Core Logic Flow (Failed Login Snippet):**
```javascript
// Inside login() ... if (!isPasswordMatch)

// 1. Atomically increment total failures
const updatedUser = await User.findOneAndUpdate(
  { _id: user._id },
  { $inc: { failedLoginAttempts: 1, totalFailedAttempts: 1 } },
  { new: true }
);

// 2. Calculate the actual math in the external util file
const { riskScore, systemStatus } = calculateRiskScoreAndStatus(
  updatedUser.failedLoginAttempts,
  updatedUser.totalFailedAttempts
);

// 3. Save the new risk status back to the database
await User.updateOne({ _id: user._id }, { $set: { riskScore, systemStatus } });

// 4. Log the forensic audit trail
await ActivityLog.create({
  userId: user._id,
  action: 'LOGIN_FAILURE',
  details: { email, reason: 'Invalid password', currentScore: riskScore },
  ipAddress: req.ip
});
```
*Reviewer Note:* The system is designed to be **reversible**. If the user successfully logs in on their *next* attempt, the controller purposefully resets `failedLoginAttempts: 0`. It then reruns `calculateRiskScoreAndStatus(0, total)` to downgrade the user from "HighRisk" back to "Safe".

### B. The Admin Controller (`adminController.js`)
This is a massive file dedicated to running heavy MongoDB Aggregation queries to generate the dashboard graphs and detect bad actors via deterministic thresholds.

**Core Logic Flow (Rapid Checkout Spikes Snippet):**
```javascript
export const getAnomalousActivities = async (req, res) => {
  const rapidCheckouts = await ActivityLog.aggregate([
    { $match: { action: 'checkout' } }, // Only look at purchases
    {
      $group: {
        _id: '$userId',
        checkoutCount: { $sum: 1 },
        maxTime: { $max: '$createdAt' }, // Time of last purchase
        minTime: { $min: '$createdAt' }, // Time of first purchase
      },
    },
    {
      $project: {
        checkoutCount: 1,
        // Calculate milliseconds between first and last purchase
        timeSpan: { $subtract: ['$maxTime', '$minTime'] }, 
      },
    },
    {
      $match: {
        checkoutCount: { $gt: 5 },     // More than 5 checkouts
        timeSpan: { $lt: 3600000 },    // In less than 1 hour (extreme speed)
      },
    },
  ]);
  // ... returns data to frontend
};
```
*Reviewer Note:* This utilizes MongoDB's native aggregation pipeline (`$match`, `$group`, `$project`) to shift the computational heavy lifting to the database server rather than choking the Node.js event loop iterating through millions of logs.

### C. The Analytics Controller (`analyticsController.js`)
A lightweight, high-speed controller designed simply to ingest data as fast as possible without blocking the user interface.

**Core Logic Flow (Clickstream Tracking Snippet):**
```javascript
export const trackNavigation = async (req, res) => {
  const { source, target } = req.body;

  // Fire and forget logging
  await ActivityLog.create({
      userId: req.user ? req.user.userId : null,
      action: 'PAGE_TRANSITION',
      details: { source, target },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
  });

  res.status(200).json({ success: true });
};
```

---

## 5. Security & Middleware

**Location:** `backend/middleware/`

Middleware functions run *before* the controller, acting as bouncers at the door of the API.

* `auth.js` -> `protect()`  
  Verifies the JWT token in the user's `Authorization` header to prove they are logged in.

* `auth.js` -> `adminProtect()`  
  **The ultimate gatekeeper.** It first verifies the JWT token, then queries the database to ensure `user.isAdmin === true`. If a malicious normal user attempts to `GET /api/admin/stats`, this middleware rejects it with a `403 Forbidden` before the code ever reaches `adminController`.

---

# NutriCloudMonitor: End-to-End System Working Guide

---

This document explains the **full end-to-end lifecycle** of the NutriCloudMonitor platform. It details exactly how the "innocent" eCommerce features for standard users seamlessly power the "intelligence" algorithms for the system administrators.

---

## 1. The Dual-System Concept

The platform operates on a **Dual-System Architecture**:
1. **The User Layer (HealthCart):** An eCommerce application where users can buy supplements, calculate their BMI, manage their cart, and checkout.
2. **The Intelligence Layer (SOC Admin):** A silent, invisible Behavioral Monitoring System that tracks every click, transaction, and interaction the user makes on the HealthCart platform to detect anomalies and stop bad actors.

**The Golden Rule:** Users never see the intelligence layer. They do not know their clickstreams are being mapped. Administrators have omniscient visibility but do not interact with the store.

---

## 2. Step-by-Step User Journey & System Lifecycle

Here is the exact technical flow of data as a user interacts with the system, and how the Admin Dashboard captures it.

### Step 1: The First Interaction (Registration & Login)
* **What the User Does:** A new user navigates to `/signup` and creates an account, then logs in.
* **What the System Does:** 
  - The Frontend (`AuthContext.jsx`) sends the credentials to the Express Backend.
  - The Backend (`authController.js`) validates the data and creates a MongoDB `User` document.
  - **The Intelligence Trigger:** The backend explicitly creates two `ActivityLog` documents: `SIGNUP` and `LOGIN_SUCCESS`. It records the user's IP address and Device User-Agent.
* **What the Admin Sees:** The Admin Dashboard's "Live Security Log" table updates in real-time, showing a new device registered. The user count KPI increments by +1.

### Step 2: The Core Engagement (BMI & Shopping)
* **What the User Does:** The user calculates their BMI, browses the "Protein" category, and clicks on "Whey Protein 5lbs".
* **What the System Does:**
  - The BMI is saved to their `User` schema.
  - The `/api/analytics` endpoint processes a `BMI_CALCULATED` telemetry event.
  - The silent `RouteTracker.jsx` component wraps the React Router. As the user moves from `/products` to `/product/123`, the tracker secretly fires a `PAGE_TRANSITION` event to the backend.
* **What the Admin Sees:** The user's specific BMI updates the global "BMI Distribution Pie Chart" on the Admin Overview. The `PAGE_TRANSITION` event is fed into the **Clickstream Sankey Diagram**, thickening the visual traffic river between the 'Products' node and the 'Product Detail' node.

### Step 3: The Transaction (Cart & Checkout)
* **What the User Does:** The user adds the item to their cart and submits the checkout form.
* **What the System Does:**
  - The `orderController.js` processes the data, calculates the total price, handles the database transaction, and empties the cart.
  - **The Intelligence Trigger:** An `add_to_cart` and a `checkout` event are permanently recorded in the forensic `ActivityLog`. 
* **What the Admin Sees:** The Admin Overview KPI for "Total Revenue" immediately spikes. The "Activity Graph" plots a new successful checkout metric for the current hour block.

---

## 3. Detecting Anomalies (When the Journey Goes Wrong)

The system doesn't just record data; it aggressively analyzes it. Here is how the system responds to malicious behavior.

### Scenario A: The Brute Force Attacker (Authentication Friction)
* **The Action:** A user runs a script to guess passwords, failing 6 times in a row.
* **The Intelligence Response (`calculateRiskScore.js`):**
  - With every failed attempt, the controller increments the user's `failedLoginAttempts` integer.
  - The Dynamic Risk Formula (`failedAttempts * 3`) evaluates to 18.
  - The backend reclassifies the user's `systemStatus` from **Safe** to **HighRisk**.
  - A `MULTIPLE_FAILED_ATTEMPTS` alert is hard-logged.
* **The Admin Action:** The Admin Overview flashes a **High-Priority Red Alert** in the Live Alert Panel. The Risk Distribution Pie Chart updates to show 1 more High-Risk user. If the Admin views the `Users` governance table, that specific identity is highlighted as dangerous.

### Scenario B: The Bot Scraper (Markov Matrix Drift)
* **The Action:** A headless browser (bot) avoids the UI entirely and directly sends GET requests to protected API endpoints, skipping natural page flows.
* **The Intelligence Response (`AdminController.js -> getClickstreamMatrix`):**
  - The clickstream matrix analyzes the `PAGE_TRANSITION` records.
  - It notices traffic going from `Home -> Checkout_Success` without traversing the `Cart` Node.
  - The mathematical formula evaluates `P(Target | Source)` and discovers the probability of this edge is `< 0.05` (Less than 5%).
* **The Admin Action:** On the Admin Dashboard's "Clickstream" tab, this abnormal traffic route is physically drawn and colored as an **Anomalous Behavioral Bypass**, instantly notifying the SOC analyst that an automated bot is exploiting the API structure rather than using the mouse-driven UI.

### Scenario C: The Transaction Stuffer (Deterministic Thresholds)
* **The Action:** A malicious user leverages stolen credit cards, initiating 7 distinct checkout transactions in 20 minutes to test the cards.
* **The Intelligence Response (`AdminController.js -> getAnomalousActivities`):**
  - The database runs an `$aggregate` pipeline against the `ActivityLog` collection, looking specifically at the `checkout` action.
  - It calculates the time delta (milliseconds) between the first and seventh checkout.
  - The rigid threshold is triggered: `(Count > 5) AND (TimeSpan < 1 Hour)`.
* **The Admin Action:** The "Behavioral Monitoring" tab flags this specific user ID for **"Rapid Checkout Spikes (Purchase Anomalies)"**.

---

## 4. Admin Remediation & The "Kill Switch"

Once the Intelligence Systems identify an anomaly (Scenarios A, B, or C), the platform provides absolute control to the Administrator to stop the bleeding.

1. The Admin opens the **User Governance** directory (`UsersTable.jsx`).
2. They click on the flagged malicious user to open the **Forensic Profile**.
3. The Admin reviews the chronological Security Feed for that specific user, confirming the rapid checkouts or the anomalous API bypass routes.
4. **The Kill Switch:** The Admin changes the `adminStatus` dropdown from `Active` to `Blocked`.
5. **The Result:** The Node.js Express Backend uses the `auth.js` middleware to intercept every future API request holding that user's JWT Token. It checks the database, sees the `Blocked` status, and returns a hard `403 Forbidden` error. The bad actor is instantly completely severed from interacting with the NutriCloud platform.

---

<div align="center">

### 🧑‍💻 Developed By  
Venkata Siva Reddy 
Shaik Tasleem
B.Tech – Computer Science  

---

### ⚡ Built for Intelligent Web Security  

 ---

 

</div>
