import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    action: {
      type: String,
      required: true,
      enum: [
        // Legacy support
        'login',
        'login_success',
        'login_failed',
        'signup',
        'bmi_calculation',
        'view_product',
        'add_to_cart',
        'checkout',
        'logout',

        // System auth events
        'SIGNUP',
        'LOGIN_SUCCESS',
        'LOGIN_FAILURE',
        'LOGOUT',

        // Session events
        'SESSION_START',
        'SESSION_END',
        'TOKEN_EXPIRED',

        // Behavioral events
        'BMI_CALCULATED',
        'MULTIPLE_BMI_ATTEMPTS',
        'RAPID_REQUESTS',
        'UNUSUAL_TIME_LOGIN',

        // Clickstream analytics
        'PAGE_TRANSITION',

        // Security events
        'NEW_DEVICE_LOGIN',
        'NEW_LOCATION_LOGIN',
        'MULTIPLE_FAILED_ATTEMPTS',
        'HIGH_RISK_SCORE'
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
