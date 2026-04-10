const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats, getAllUsers, deleteUser, suspendUser, unsuspendUser,
  warnUser, getUserWarnings, getAllWarnings, getAllIdeas,
  approvePayment, rejectPayment,
} = require('../controllers/admin');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/suspend', suspendUser);
router.put('/users/:userId/unsuspend', unsuspendUser);
router.post('/users/:userId/warn', warnUser);
router.get('/users/:userId/warnings', getUserWarnings);
router.get('/warnings', getAllWarnings);
router.get('/ideas', getAllIdeas);
router.put('/payments/:paymentId/approve', approvePayment);
router.put('/payments/:paymentId/reject', rejectPayment);

module.exports = router;
