import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { calculateBMI, getBMICategory, getDietPlan } from '../utils/bmiCalculator.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        bmiCategory: user.bmiCategory,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password, height, weight } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (height) user.height = height;
    if (weight) user.weight = weight;

    // Calculate BMI if both height and weight are provided
    if (height && weight) {
      user.bmi = calculateBMI(weight, height);
      user.bmiCategory = getBMICategory(user.bmi);

      // Detect Multiple BMI Attempts (Behavioral SOC Event)
      const lastBmiLog = await ActivityLog.findOne({
        userId: user._id,
        action: { $in: ['BMI_CALCULATED', 'MULTIPLE_BMI_ATTEMPTS'] }
      }).sort({ createdAt: -1 });

      const isRapidRecalculation = lastBmiLog && (Date.now() - new Date(lastBmiLog.createdAt).getTime() < 5 * 60 * 1000); // 5 mins

      // Log BMI calculation
      await ActivityLog.create({
        userId: user._id,
        action: isRapidRecalculation ? 'MULTIPLE_BMI_ATTEMPTS' : 'BMI_CALCULATED',
        details: {
          height,
          weight,
          bmi: user.bmi,
          category: user.bmiCategory,
        },
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        bmiCategory: user.bmiCategory,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const calculateBMIAndGetDiet = async (req, res) => {
  try {
    const { height, weight } = req.body;

    if (!height || !weight) {
      return res.status(400).json({ message: 'Please provide height and weight' });
    }

    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi);
    const dietPlan = getDietPlan(bmiCategory);

    // Update user BMI
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        height,
        weight,
        bmi,
        bmiCategory,
      },
      { new: true }
    );

    // Detect Multiple BMI Attempts
    const lastBmiLog = await ActivityLog.findOne({
      userId: user._id,
      action: { $in: ['BMI_CALCULATED', 'MULTIPLE_BMI_ATTEMPTS'] }
    }).sort({ createdAt: -1 });

    const isRapidRecalculation = lastBmiLog && (Date.now() - new Date(lastBmiLog.createdAt).getTime() < 5 * 60 * 1000);

    // Log activity
    await ActivityLog.create({
      userId: user._id,
      action: isRapidRecalculation ? 'MULTIPLE_BMI_ATTEMPTS' : 'BMI_CALCULATED',
      details: {
        height,
        weight,
        bmi,
        category: bmiCategory,
      },
    });

    res.status(200).json({
      success: true,
      bmi,
      bmiCategory,
      dietPlan,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        bmiCategory: user.bmiCategory,
        systemStatus: user.systemStatus,
        adminStatus: user.adminStatus
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDietRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.bmiCategory) {
      return res.status(400).json({
        message: 'Please calculate BMI first',
      });
    }

    const dietPlan = getDietPlan(user.bmiCategory);

    res.status(200).json({
      success: true,
      bmiCategory: user.bmiCategory,
      dietPlan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
