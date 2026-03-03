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
