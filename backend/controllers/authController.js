import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import jwt from 'jsonwebtoken';
import { calculateRiskScoreAndStatus } from '../utils/calculateRiskScore.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

const getPasswordStrength = (password) => {
  let score = 0;
  const value = String(password || '');

  if (value.length >= 8) score++;
  if (/[a-z]/.test(value)) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};

export const signup = async (req, res) => {
  try {
    let { name, email, password, confirmPassword } = req.body;

    name = String(name || '').trim();
    email = String(email || '').trim().toLowerCase();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const passwordStrength = getPasswordStrength(password);
    if (passwordStrength === 'weak') {
      return res.status(400).json({
        message: 'Password is too weak. Use at least 8 characters with uppercase, lowercase, number, and special character.',
      });
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
    let { email, password } = req.body;

    email = String(email || '').trim().toLowerCase();

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 1. Soft Delete Check
    if (user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Admin Block Check
    if (user.adminStatus === 'Blocked') {
      return res.status(403).json({ message: 'Account permanently blocked by administrator.' });
    }

    // 3. Admin Suspend Check
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
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $inc: { failedLoginAttempts: 1, totalFailedAttempts: 1 } },
        { new: true }
      );

      let lockUpdates = {};
      if (updatedUser.failedLoginAttempts >= 5) {
        lockUpdates.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
      }

      const { riskScore, systemStatus } = calculateRiskScoreAndStatus(
        updatedUser.failedLoginAttempts,
        updatedUser.totalFailedAttempts
      );

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

      await ActivityLog.create({
        userId: user._id,
        action: 'LOGIN_FAILURE',
        details: { email, reason: 'Invalid password', currentScore: riskScore },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      });

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

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { failedLoginAttempts: 0, lockUntil: null },
        $inc: { loginCount: 1 }
      },
      { new: true }
    );

    const { riskScore, systemStatus } = calculateRiskScoreAndStatus(
      0,
      updatedUser.totalFailedAttempts
    );

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
        height: updatedUser.height,
        weight: updatedUser.weight,
        bmi: updatedUser.bmi,
        bmiCategory: updatedUser.bmiCategory,
        systemStatus,
        adminStatus: updatedUser.adminStatus
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
