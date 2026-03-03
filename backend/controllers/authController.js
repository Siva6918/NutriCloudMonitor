import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import jwt from 'jsonwebtoken';
import { calculateRiskScoreAndStatus } from '../utils/calculateRiskScore.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Log activity
    await ActivityLog.create({
      userId: user._id,
      action: 'SIGNUP',
      details: { email },
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // --- Access Control Rule Hierarchy ---
    // 1. Soft Delete Check
    if (user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Admin Block Check (No metric mutation)
    if (user.adminStatus === 'Blocked') {
      return res.status(403).json({ message: 'Account permanently blocked by administrator.' });
    }

    // 3. Admin Suspend Check (No metric mutation)
    if (user.adminStatus === 'Suspended') {
      return res.status(403).json({ message: 'Account is temporarily suspended.' });
    }

    // 4. Cooldown Lock Check
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({
        message: `Account temporarily locked due to multiple failed attempts. Try again in ${remainingTime} minutes.`
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      // --- Failed Login Flow ---
      // 1. Atomically increment attempts to prevent race conditions
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $inc: { failedLoginAttempts: 1, totalFailedAttempts: 1 } },
        { new: true }
      );

      // 2. Enforce Cooldown Rules
      let lockUpdates = {};
      if (updatedUser.failedLoginAttempts >= 5) {
        lockUpdates.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes lock
      }

      // 3. Recalculate System Risk Metrics after mutation
      const { riskScore, systemStatus } = calculateRiskScoreAndStatus(
        updatedUser.failedLoginAttempts,
        updatedUser.totalFailedAttempts
      );

      // 4. Persist Security Data
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            riskScore,
            systemStatus,
            ...lockUpdates
          }
        }
      );

      // 5. Log Forensic Event
      await ActivityLog.create({
        userId: user._id,
        action: 'LOGIN_FAILURE',
        details: { email, reason: 'Invalid password', currentScore: riskScore },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      });

      // 6. Log High-Risk Multiple Attempts if Locked
      if (updatedUser.failedLoginAttempts >= 5) {
        await ActivityLog.create({
          userId: user._id,
          action: 'MULTIPLE_FAILED_ATTEMPTS',
          details: { failures: updatedUser.failedLoginAttempts },
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent']
        });
      }

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // --- Successful Login Flow ---
    // 1. Atomically Reset short-term failures and add to login count
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { failedLoginAttempts: 0, lockUntil: null },
        $inc: { loginCount: 1 }
      },
      { new: true }
    );

    // 2. Recalculate Metrics (Ensures Reversibility / Downgrade of HighRisk flag)
    const { riskScore, systemStatus } = calculateRiskScoreAndStatus(
      0, // Short term memory is clear
      updatedUser.totalFailedAttempts
    );

    // 3. Save Final State
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          riskScore,
          systemStatus,
          lastLogin: new Date()
        }
      }
    );

    // 4. Log Forensic Event
    await ActivityLog.create({
      userId: user._id,
      action: 'LOGIN_SUCCESS',
      details: { email, riskCleared: riskScore === 0 },
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        bmiCategory: user.bmiCategory,
        systemStatus,
        adminStatus: user.adminStatus
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
