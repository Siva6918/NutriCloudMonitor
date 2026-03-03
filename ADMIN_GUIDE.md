# Admin Dashboard Features

## Overview

The admin dashboard provides comprehensive monitoring and management capabilities for the HealthCart platform.

## Admin Features

### 1. Dashboard Overview
- **Total Users**: Count of all registered users
- **Total Orders**: Count of all orders placed
- **Total Revenue**: Sum of all order values
- **Average Order Value**: Revenue per order
- **BMI Distribution**: Visual chart of user BMI categories
- **Top Products**: Best-selling products by revenue

### 2. User Management
- View all users with their details
- Filter and search functionality
- Monitor user BMI categories
- Track user registration dates
- Access individual user profiles

### 3. Activity Monitoring
- Real-time activity logs
- Track user actions:
  - Login/Signup events
  - BMI calculations
  - Product views
  - Cart additions
  - Checkouts
  - Logout events

### 4. Anomaly Detection
- **Suspicious Login Activity**: Detects multiple failed login attempts
- **Rapid Checkout Activity**: Identifies suspicious purchase patterns
- **Bot Detection**: Finds abnormal behavior patterns
- Alerts for potentially fraudulent activities

## Admin Access

### Login Credentials
- **Email**: admin@healthcart.com
- **Password**: admin123

### Access Points
- User Route: `http://localhost:3000/admin/login`
- Admin Dashboard: `http://localhost:3000/admin/dashboard`

## Monitored Metrics

### User Analytics
- Total active users
- New user registrations
- User engagement (BMI calculations)
- Product browsing patterns

### Order Analytics
- Order volume and trends
- Revenue tracking
- Average order value
- Top-selling products
- Order completion rates

### Activity Logs
- Timestamp of all activities
- User identification
- Action type and details
- Duration of sessions

## Anomaly Detection Rules

### Login Anomalies
- More than 10 login attempts in short period
- Failed login attempts from suspicious IPs
- Unusual login times or locations

### Purchase Anomalies
- More than 5 checkouts within 1 hour
- Extremely high order values
- Rapid successive purchases of same product
- Multiple orders from same user quickly

### Behavior Anomalies
- Viewing 100+ products in short time
- Adding/removing items rapidly
- Cart modifications without checkout

## Admin API Endpoints

### Authentication
```
POST /api/admin/auth/login
POST /api/admin/auth/register
```

### Dashboard Statistics
```
GET /api/admin/stats              - Get all dashboard statistics
GET /api/admin/users              - Get all users
GET /api/admin/users/:id          - Get specific user
GET /api/admin/activities         - Get all activities
GET /api/admin/activities/:userId - Get user-specific activities
GET /api/admin/anomalies          - Get detected anomalies
```

## Dashboard Sections

### 1. Overview Tab
- Key metrics and statistics
- BMI distribution chart
- Recent top products
- User engagement metrics

### 2. Users Tab
- List of recent users
- User details (name, email, BMI, category)
- Join date information
- Quick access to user profiles

### 3. Monitoring Tab
- Real-time activity feed
- Anomaly alerts
- Suspicious activity detection
- Activity history with timestamps

## Data Insights

### User Segments
Track users by BMI category to understand health demographics:
- Underweight users (BMI < 18.5)
- Normal weight users (BMI 18.5-24.9)
- Overweight users (BMI 25-29.9)
- Obese users (BMI ≥ 30)

### Product Insights
- Most viewed products
- Best-selling items
- Revenue per product
- Product category performance

### Revenue Analytics
- Total platform revenue
- Revenue by product category
- Average transaction value
- Revenue trends over time

## Security Features

- JWT token-based authentication
- Separate admin authentication from users
- Protected admin routes
- Activity logging of all admin actions
- Anomaly detection for suspicious behavior

## Future Enhancements

- Real-time notifications for anomalies
- Custom report generation
- Email alerts for suspicious activities
- Advanced filtering and search
- Data export functionality
- Admin role management
- API rate limiting monitoring
- Geographic activity tracking

## Setup Instructions

### Create Admin User
```bash
cd backend
node seeds/seedAdmin.js
```

### Default Admin Credentials
- Email: admin@healthcart.com
- Password: admin123

**⚠️ Important**: Change admin password after first login in production!

## Dashboard Navigation

1. **Overview**: Main metrics and statistics
2. **Users**: User management and details
3. **Monitoring**: Activity logs and anomaly detection
4. **Logout**: Secure logout from admin panel

---

The admin dashboard is built for scalability and can handle real-time monitoring of platform activities and user behavior patterns.
