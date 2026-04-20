import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import Order from '../models/Order.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const totalSuspicious = await User.countDocuments({ systemStatus: 'Suspicious', isDeleted: false });
    const totalHighRisk = await User.countDocuments({ systemStatus: 'HighRisk', isDeleted: false });
    const totalSuspended = await User.countDocuments({ adminStatus: 'Suspended', isDeleted: false });
    const totalBlocked = await User.countDocuments({ adminStatus: 'Blocked', isDeleted: false });

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    const bmiDistribution = await User.aggregate([
      {
        $group: {
          _id: '$bmiCategory',
          count: { $sum: 1 },
        },
      },
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const topProducts = await Order.aggregate([
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.productId',
          count: { $sum: 1 },
          name: { $first: '$items.name' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const activityStats = await ActivityLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSuspicious,
        totalHighRisk,
        totalSuspended,
        totalBlocked,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        bmiDistribution,
        recentUsers,
        topProducts,
        activityStats,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0, action } = req.query;

    const filter = { userId };
    if (action) {
      filter.action = action;
    }

    const activities = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const totalActivities = await ActivityLog.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: totalActivities,
      activities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllActivities = async (req, res) => {
  try {
    const { action, limit = 50, skip = 0 } = req.query;
    const filter = {};

    if (action) {
      filter.action = action;
    }

    const activities = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('userId', 'name email');

    const totalActivities = await ActivityLog.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: totalActivities,
      activities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnomalousActivities = async (req, res) => {
  try {
    const suspiciousUsers = await ActivityLog.aggregate([
      {
        $match: {
          action: {
            $in: [
              'login',
              'login_failed',
              'LOGIN_FAILURE',
              'login_success',
              'LOGIN_SUCCESS',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          loginCount: { $sum: 1 },
          lastLogin: { $max: '$createdAt' },
        },
      },
      {
        $match: { loginCount: { $gt: 10 } },
      },
      {
        $sort: { loginCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const rapidCheckouts = await ActivityLog.aggregate([
      {
        $match: { action: 'checkout' },
      },
      {
        $group: {
          _id: '$userId',
          checkoutCount: { $sum: 1 },
          maxTime: { $max: '$createdAt' },
          minTime: { $min: '$createdAt' },
        },
      },
      {
        $project: {
          checkoutCount: 1,
          timeSpan: {
            $subtract: ['$maxTime', '$minTime'],
          },
        },
      },
      {
        $match: {
          checkoutCount: { $gt: 5 },
          timeSpan: { $lt: 3600000 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      anomalies: {
        suspiciousLoginActivity: suspiciousUsers,
        rapidCheckoutActivity: rapidCheckouts,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminStatus } = req.body;

    if (!['Active', 'Suspended', 'Blocked'].includes(adminStatus)) {
      return res.status(400).json({ message: 'Invalid admin status' });
    }

    const user = await User.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.adminStatus = adminStatus;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status successfully updated to ${adminStatus}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = true;
    user.adminStatus = 'Blocked';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User successfully deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSOCMetrics = async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const totalActiveUsers = await User.countDocuments({ isDeleted: false });

    const totalSessionsToday = await ActivityLog.countDocuments({
      action: { $in: ['login_success', 'LOGIN_SUCCESS'] },
      createdAt: { $gte: oneDayAgo },
    });

    const failedLoginAttempts = await ActivityLog.countDocuments({
      action: { $in: ['login_failed', 'LOGIN_FAILURE', 'MULTIPLE_FAILED_ATTEMPTS'] },
      createdAt: { $gte: oneDayAgo },
    });

    const recentFailedLogins = await ActivityLog.aggregate([
      {
        $match: {
          action: { $in: ['login_failed', 'LOGIN_FAILURE', 'MULTIPLE_FAILED_ATTEMPTS'] },
          createdAt: { $gte: oneDayAgo },
        },
      },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
        },
      },
      {
        $match: { count: { $gt: 5 } },
      },
    ]);

    const detectedAnomalies = recentFailedLogins.length;

    const kpi = {
      totalActiveUsers: {
        current: totalActiveUsers,
        trend: [
          totalActiveUsers > 5 ? totalActiveUsers - 5 : 0,
          totalActiveUsers > 2 ? totalActiveUsers - 2 : 0,
          totalActiveUsers,
        ],
      },
      totalSessionsToday: {
        current: totalSessionsToday,
        trend: [
          Math.floor(totalSessionsToday * 0.8),
          Math.floor(totalSessionsToday * 0.9),
          totalSessionsToday,
        ],
      },
      failedLoginAttempts: {
        current: failedLoginAttempts,
        trend: [
          Math.floor(failedLoginAttempts * 0.5),
          Math.floor(failedLoginAttempts * 0.8),
          failedLoginAttempts,
        ],
      },
      detectedAnomalies: {
        current: detectedAnomalies,
        trend: [0, Math.floor(detectedAnomalies / 2), detectedAnomalies],
      },
      averageRiskScore: {
        current: detectedAnomalies > 0 ? 35 : 12,
        trend: [10, 15, detectedAnomalies > 0 ? 35 : 12],
      },
    };

    const last24hLogs = await ActivityLog.find({ createdAt: { $gte: oneDayAgo } });
    const activityTrendMap = {};

    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getTime() - i * 4 * 60 * 60 * 1000);
      const hourLabel = d.getHours().toString().padStart(2, '0') + ':00';
      activityTrendMap[hourLabel] = {
        time: hourLabel,
        successfulLogins: 0,
        failedLogins: 0,
        checkouts: 0,
      };
    }

    last24hLogs.forEach((log) => {
      const d = new Date(log.createdAt);
      const bucketHour = Math.floor(d.getHours() / 4) * 4;
      const hourLabel = bucketHour.toString().padStart(2, '0') + ':00';

      if (!activityTrendMap[hourLabel]) {
        activityTrendMap[hourLabel] = {
          time: hourLabel,
          successfulLogins: 0,
          failedLogins: 0,
          checkouts: 0,
        };
      }

      if (['login_success', 'LOGIN_SUCCESS'].includes(log.action)) {
        activityTrendMap[hourLabel].successfulLogins++;
      }

      if (['login_failed', 'LOGIN_FAILURE', 'MULTIPLE_FAILED_ATTEMPTS'].includes(log.action)) {
        activityTrendMap[hourLabel].failedLogins++;
      }

      if (log.action === 'checkout') {
        activityTrendMap[hourLabel].checkouts++;
      }
    });

    const activityTrend = Object.values(activityTrendMap).sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    const highRisk = await User.countDocuments({ systemStatus: 'HighRisk', isDeleted: false });
    const medRisk = await User.countDocuments({ systemStatus: 'Suspicious', isDeleted: false });
    const lowRisk = totalActiveUsers - highRisk - medRisk;

    const riskDistribution = [
      { name: 'Low Risk (0-30)', count: lowRisk > 0 ? lowRisk : 0, color: '#22c55e' },
      { name: 'Medium Risk (31-70)', count: medRisk, color: '#f59e0b' },
      { name: 'High Risk (71-100)', count: highRisk, color: '#ef4444' },
    ];

    const alerts = [];
    if (recentFailedLogins.length > 0) {
      alerts.push({
        id: `alert-${Date.now()}`,
        time: 'Recently',
        type: 'MULTIPLE_FAILED_ATTEMPTS',
        risk: 'HIGH',
        user: recentFailedLogins[0]._id ? recentFailedLogins[0]._id.toString() : 'Unknown Identity',
        ip: 'Tracked Node',
        description: `${recentFailedLogins[0].count} failed login attempts detected by system.`,
      });
    } else {
      alerts.push({
        id: 'alert-sys',
        time: 'Just Now',
        type: 'SYSTEM_AUDIT',
        risk: 'INFO',
        user: 'SYSTEM',
        ip: 'internal',
        description: 'SOC Monitoring active and checking streams.',
      });
    }

    const productViews = await ActivityLog.countDocuments({
      action: 'view_product',
      createdAt: { $gte: oneDayAgo },
    });

    const addsToCart = await ActivityLog.countDocuments({
      action: 'add_to_cart',
      createdAt: { $gte: oneDayAgo },
    });

    const checkouts = await ActivityLog.countDocuments({
      action: 'checkout',
      createdAt: { $gte: oneDayAgo },
    });

    const clickstream = [
      { source: 'Home', target: 'Products', value: productViews > 0 ? productViews + 50 : 50 },
      { source: 'Products', target: 'Product Detail', value: productViews > 0 ? productViews : 20 },
      { source: 'Product Detail', target: 'Cart', value: addsToCart > 0 ? addsToCart : 5 },
      { source: 'Cart', target: 'Checkout', value: checkouts > 0 ? checkouts : 2 },
      { source: 'Checkout', target: 'Success', value: checkouts > 0 ? Math.floor(checkouts * 0.8) : 1 },
      { source: 'Home', target: 'Checkout', value: 1 },
    ];

    const sessionAnalytics = {
      devices: [
        { name: 'Desktop (Windows)', value: 65, fill: '#3b82f6' },
        { name: 'Desktop (Mac)', value: 25, fill: '#8b5cf6' },
        { name: 'Mobile Devices', value: 10, fill: '#ec4899' },
      ],
      duration: [
        { range: '0-5m', users: totalSessionsToday > 0 ? Math.ceil(totalSessionsToday * 0.4) : 10 },
        { range: '5-15m', users: totalSessionsToday > 0 ? Math.ceil(totalSessionsToday * 0.3) : 5 },
        { range: '15-30m', users: totalSessionsToday > 0 ? Math.ceil(totalSessionsToday * 0.2) : 2 },
        { range: '30m+', users: totalSessionsToday > 0 ? Math.ceil(totalSessionsToday * 0.1) : 1 },
      ],
    };

    res.status(200).json({
      success: true,
      data: {
        kpi,
        activityTrend,
        riskDistribution,
        alerts,
        clickstream,
        sessionAnalytics,
        geoData: [],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClickstreamMatrix = async (req, res) => {
  try {
    const transitions = await ActivityLog.aggregate([
      { $match: { action: 'PAGE_TRANSITION' } },
      {
        $group: {
          _id: { source: '$details.source', target: '$details.target' },
          count: { $sum: 1 },
        },
      },
    ]);

    const sourceTotals = {};
    transitions.forEach((t) => {
      const source = t._id.source;
      if (!sourceTotals[source]) sourceTotals[source] = 0;
      sourceTotals[source] += t.count;
    });

    const matrix = transitions.map((t) => {
      const source = t._id.source;
      const target = t._id.target;
      const count = t.count;
      const probability = sourceTotals[source] > 0 ? count / sourceTotals[source] : 0;

      return {
        source,
        target,
        value: count,
        probability: Math.round(probability * 1000) / 1000,
      };
    });

    matrix.sort((a, b) => b.value - a.value);

    const normalFlow = [];
    const anomalousFlow = [];

    matrix.forEach((edge) => {
      if (edge.probability < 0.05 && sourceTotals[edge.source] >= 5) {
        anomalousFlow.push(edge);
      } else {
        normalFlow.push(edge);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        normalFlow,
        anomalousFlow,
        rawMatrix: matrix,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
