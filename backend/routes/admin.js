import express from 'express';
import {
  getAllUsers,
  getUserById,
  getDashboardStats,
  getUserActivity,
  getAllActivities,
  getAnomalousActivities,
  updateUserAdminStatus,
  softDeleteUser,
  getSOCMetrics,
  getClickstreamMatrix,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All admin routes are protected
router.use(protect);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/dashboard', getDashboardStats);
router.get('/soc-metrics', getSOCMetrics);
router.get('/activities/:userId', getUserActivity);
router.get('/activities', getAllActivities);
router.get('/anomalies', getAnomalousActivities);
router.get('/clickstream-matrix', getClickstreamMatrix);
router.put('/users/:id/status', updateUserAdminStatus);
router.delete('/users/:id', softDeleteUser);

export default router;
