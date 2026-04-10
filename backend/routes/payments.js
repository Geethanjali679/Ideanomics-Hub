const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { initiatePayment, getMyPayments, getAllPayments, reviewPayment } = require('../controllers/payments');

router.post('/', protect, authorize('investor'), initiatePayment);
router.get('/my', protect, authorize('investor'), getMyPayments);
router.get('/', protect, authorize('admin'), getAllPayments);
router.put('/:paymentId/review', protect, authorize('admin'), reviewPayment);

module.exports = router;
