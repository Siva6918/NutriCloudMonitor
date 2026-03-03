import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
      enum: [
        // Legacy Support
        'login', 'login_success', 'login_failed', 'signup', 'bmi_calculation', 'view_product', 'add_to_cart', 'checkout', 'logout',
        // System Auth Events
        'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT',
        // Session Events
        'SESSION_START', 'SESSION_END', 'TOKEN_EXPIRED',
        // Behavioral Events
        'BMI_CALCULATED', 'MULTIPLE_BMI_ATTEMPTS', 'RAPID_REQUESTS', 'UNUSUAL_TIME_LOGIN',
        // Clickstream Analytics
        'PAGE_TRANSITION',
        // Security Events
        'NEW_DEVICE_LOGIN', 'NEW_LOCATION_LOGIN', 'MULTIPLE_FAILED_ATTEMPTS', 'HIGH_RISK_SCORE'
      ],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ActivityLog', activityLogSchema);
