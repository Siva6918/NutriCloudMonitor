import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    height: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    bmi: {
      type: Number,
      default: null,
    },
    bmiCategory: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      default: null,
    },
    // --- Behavioral & Security Tracking Fields ---
    systemStatus: {
      type: String,
      enum: ['Safe', 'Suspicious', 'HighRisk'],
      default: 'Safe',
    },
    adminStatus: {
      type: String,
      enum: ['Active', 'Suspended', 'Blocked'],
      default: 'Active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    totalFailedAttempts: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
    },
    riskScore: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// --- Indexes for Dashboard & Filtering Optimization ---
userSchema.index({ adminStatus: 1, systemStatus: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ failedLoginAttempts: -1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
