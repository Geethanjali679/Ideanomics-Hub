const Payment = require('../models/Payment');
const User = require('../models/User');
const { createNotification } = require('./notifications');

exports.initiatePayment = async (req, res) => {
  try {
    const { transactionId, upiId } = req.body;
    if (!transactionId || !transactionId.trim()) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }
    const existing = await Payment.findOne({ userId: req.user.id, status: 'pending' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a pending payment awaiting approval' });
    }
    const payment = await Payment.create({
      userId: req.user.id,
      transactionId: transactionId.trim(),
      upiId: upiId?.trim() || '',
      amount: 200,
      status: 'pending',
    });
    await createNotification(
      req.user.id,
      'system',
      'Payment Submitted',
      `Your payment (TXN: ${transactionId.trim()}) has been submitted. We'll notify you once reviewed.`,
      '/investor/payment'
    );
    res.status(201).json({ success: true, message: 'Payment submitted for review. You will be notified once approved.', payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ success: true, payments, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.reviewPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { action, notes } = req.body;
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action. Use "approve" or "reject"' });
    }
    const payment = await Payment.findById(paymentId).populate('userId', 'name email');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    if (payment.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Payment has already been reviewed' });
    }

    payment.status = action === 'approve' ? 'approved' : 'rejected';
    payment.reviewedBy = req.user.id;
    payment.reviewedAt = new Date();
    payment.notes = notes?.trim() || '';
    await payment.save();

    if (action === 'approve') {
      await User.findByIdAndUpdate(payment.userId._id, { isPremium: true });
      await createNotification(
        payment.userId._id,
        'payment_approved',
        '🎉 Payment Approved!',
        'Your premium payment has been approved. You now have unlimited idea access!',
        '/browse'
      );
    } else {
      await createNotification(
        payment.userId._id,
        'payment_rejected',
        'Payment Rejected',
        `Your payment was rejected.${notes ? ' Reason: ' + notes : ' Please contact support or try again.'}`,
        '/investor/payment'
      );
    }

    res.json({ success: true, message: `Payment ${payment.status}`, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
