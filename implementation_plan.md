# Admin Dashboard Enhancements & Behavioral Anomaly Scoring Implementation Plan

This document outlines the structural restructuring of the Admin Dashboard into a modular React architecture and the integration of a backend rule-based behavioral anomaly scoring system.

## Proposed Changes

### Frontend Component Restructuring
We will reorganize the frontend `/admin` directory for better modularity and cleaner architecture, implementing the suggested component hierarchy.

#### [MODIFY] [frontend/src/components/Admin/AdminLogin.jsx](file:///c:/Users/vasan/Let_It_Be___/WEB_DEV/NutriCloudMonitor/frontend/src/components/Admin/AdminLogin.jsx)
- Add visible sample admin credentials below the login form exactly as explicitly required: `Email: admin@nutri.co`, `Password: admin918`.
- Style credentials subtly with a note "Demo Admin Access for Testing".

#### [NEW] `frontend/src/components/Admin/components/AdminSidebar.jsx`
- Create a reusable sidebar navigation component (Overview, Users, Monitoring, Logout).
- Implement dark theme professional SaaS styling.

#### [NEW] `frontend/src/components/Admin/components/SummaryCards.jsx`
- Create a top-level summary section displaying: Total Users, Suspicious Users, Suspended Users, and Blocked Users.

#### [NEW] `frontend/src/components/Admin/components/UsersTable.jsx`
- Design a clean, dark-themed data table for users.
- Columns: User Name, Email, Login Count, Failed Attempts, Last Login, Behavior Score, Status, Actions (Suspend / Block / Delete).

#### [NEW] `frontend/src/components/Admin/components/UserRow.jsx`
- A single row component for the `UsersTable` managing individual user actions and displaying the nested `StatusBadge`.

#### [NEW] `frontend/src/components/Admin/components/StatusBadge.jsx`
- A colored pill component representing user status.
  - Green → Safe / Active
  - Orange → Suspicious
  - Yellow → Suspended
  - Red → Blocked

#### [NEW] `frontend/src/components/Admin/components/BehaviorPanel.jsx`
- A specific view or expanded row section showing detailed behavioral metrics: Login activity count, last login, failed attempts.

#### [MODIFY] [frontend/src/components/Admin/AdminDashboard.jsx](file:///c:/Users/vasan/Let_It_Be___/WEB_DEV/NutriCloudMonitor/frontend/src/components/Admin/AdminDashboard.jsx)
- Refactor to act as the main high-level container.
- Use `AdminSidebar` on the left and render `SummaryCards`, `BehaviorPanel`, and `UsersTable` on the right based on the active state.
- Apply a dark theme (professional SaaS style).

---

### Backend Anomaly Scoring & Metrics

The system distinguishes between automated anomaly classification (system-level behavioral evaluation) and administrative enforcement (manual governance), ensuring consistent security logic and preventing privilege override conflicts. The modularized architecture supports extensibility toward ML-based anomaly detection while maintaining deterministic rule-based interpretability.

The core philosophy: **Automated behavioral classification informs administrative decisions without overriding human governance controls.**

#### [NEW] `backend/utils/calculateRiskScore.js`
- Create a centralized utility to compute the risk score and determine the automated system status.
- **Formula:** `riskScore = (failedLoginAttempts × 3) + (totalFailedAttempts > 10 ? 2 : 0)`
  *(Note: The static `loginCount` penalty was removed to prevent penalizing legitimate, long-term active users over time).*
- **System Classification:**
  - `score <= 2 → Safe`
  - `score 3–5 → Suspicious`
  - `score > 5 → HighRisk (Flags user for admin review, but does not auto-block)`
- **Reversibility Guarantee**: The logic must explicitly allow `systemStatus` to downgrade (e.g., from `HighRisk` to `Suspicious` or `Safe`) if the user's `riskScore` decreases following successful logins and cleared failed attempts.

#### [MODIFY] [backend/models/User.js](file:///c:/Users/vasan/Let_It_Be___/WEB_DEV/NutriCloudMonitor/backend/models/User.js)
- Overhaul tracking fields to support dual-state logic and long-term security metrics:
  - `systemStatus`: String (Enum: 'Safe', 'Suspicious', 'HighRisk', default: 'Safe') - *AI/System controlled*
  - `adminStatus`: String (Enum: 'Active', 'Suspended', 'Blocked', default: 'Active') - *Human controlled*
  - `isDeleted`: Boolean (default: false) - *Soft deletion to preserve forensic data*
  - `loginCount`: Number (default: 0)
  - `failedLoginAttempts`: Number (default: 0) - *Resets on successful login*
  - `totalFailedAttempts`: Number (default: 0) - *Persistent metric for long-term pattern tracking*
  - `lastLogin`: Date
  - `riskScore`: Number (default: 0) - Store the computed score persistently.
  - `lockUntil`: Date (default: null) - *Temporary account lock state for cooldowns*
- Add MongoDB compound indexes for optimized dashboard querying: `{ adminStatus: 1, systemStatus: 1 }`, `{ isDeleted: 1 }`, and single-field analytics indexes: `{ failedLoginAttempts: -1 }`.

#### [MODIFY] [backend/models/ActivityLog.js](file:///c:/Users/vasan/Let_It_Be___/WEB_DEV/NutriCloudMonitor/backend/models/ActivityLog.js) 
- Ensure the model robustly supports behavior tracking.
- Ensure the `action` enum supports: `login_success` and `login_failed`.
- Add forensic fields: `ipAddress: String` and `userAgent: String` to future-proof the system for ML-based anomaly detection.

#### [MODIFY] [backend/controllers/authController.js](file:///c:/Users/vasan/Let_It_Be___/WEB_DEV/NutriCloudMonitor/backend/controllers/authController.js) (or login controller)
- **Login Decision Order (Precedence):** 
  1. `if (isDeleted) return 404/deny;`
  2. `if (adminStatus === 'Blocked') deny login;` (Do not update metrics for blocked users)
  3. `if (adminStatus === 'Suspended') deny login;` (Do not update metrics)
  4. `if (lockUntil && lockUntil > Date.now()) deny login;`
  5. `Else:` Process login attempt and then recalculate metrics.
- **Rate Limiting:** Apply `express-rate-limit` strictly to the `/login` route to prevent brute-force attacks without impacting admin APIs.
- Track successful logins (increment `loginCount`, reset `failedLoginAttempts` to `0`, and update `lastLogin`).
- Track failed logins by incrementing both `failedLoginAttempts` and `totalFailedAttempts` atomically using `$inc` to prevent race conditions during concurrent attempts.
  - *Cooldown Logic*: If `failedLoginAttempts >= 5`, set `lockUntil` to `Date.now() + 10 minutes`.
- Log these events to `ActivityLog` as `login_success` or `login_failed`.
- Call `calculateRiskScore()` *only after metric mutation* on every valid login attempt to update `riskScore` and `systemStatus`.

#### [MODIFY] [backend/controllers/adminController.js](file:///c:/Users/vasan/Let_It_Be___/WEB_DEV/NutriCloudMonitor/backend/controllers/adminController.js)
- Modify [getAllUsers](file:///c:/Users/vasan/Let_It_Be___/WEB_DEV/NutriCloudMonitor/backend/controllers/adminController.js#5-18) and [getDashboardStats](file:///c:/Users/vasan/Let_It_Be___/WEB_DEV/NutriCloudMonitor/backend/controllers/adminController.js#36-108) to fetch the persisted `riskScore`, `systemStatus`, `adminStatus`, ignoring `isDeleted: true` users by default.
- Add functionality for admin to manually update `adminStatus` (Suspend, Block).
- Modify "Delete User" action to perform a soft delete (`isDeleted: true`) rather than physically removing the document.

#### [MODIFY] `backend/routes/adminRoutes.js`
- Add routes to handle manual `adminStatus` changes & soft deletion.

## Verification Plan

### Edge Case Testing & Functional Verification
1. **Frontend Rendering**: Navigate to `/admin/login` and verify visual presence of the demo credentials.
2. **Dashboard Layout**: Log in and verify the sidebar, summary cards, and tables render correctly in a dark SaaS theme.
3. **Anomaly Logic & Edge Cases**: 
   - **Multiple rapid failed logins**: Test repeatedly failing login to ensure `failedLoginAttempts` increments, `riskScore` calculation triggers, and user's `systemStatus` eventually transitions to `HighRisk` (flagged for review, not blocked).
   - **Successful login resets failedLoginAttempts**: Confirm a successful login resets the `failedLoginAttempts` back to 0.
   - **Admin manually suspends user**: Test the admin UI action to suspend a user.
   - **Suspended user cannot log in**: Crucial check to ensure a user marked as `Suspended` or `Blocked` is completely denied access at the `/login` endpoint.
   - **Blocked user attempts are ignored**: Verify that a user whose `adminStatus` is `Blocked` does not increment `failedLoginAttempts` or `riskScore` when attempting to log in, preventing attackers from inflating their metrics.
   - **Concurrency Test**: 
     - Open two browser tabs simultaneously.
     - Tab 1: Trigger rapid failed logins.
     - Tab 2: Admin manually suspends the user.
     - Verify data consistency: ensure the `riskScore` updates without race conditions and the `adminStatus` enforcement successfully locks out the user despite system calculation updates.
   - **Recovery / Downgrade Test**:
     - Trigger `HighRisk` via rapid failures.
     - Wait for the 10-minute cooldown to expire.
     - Perform a successful login.
     - Verify that `failedLoginAttempts` resets, the `riskScore` recalculates downward, and `systemStatus` automatically transitions back to `Suspicious` or `Safe`.
