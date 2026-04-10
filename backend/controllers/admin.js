const User = require('../models/User');
const Idea = require('../models/Idea');
const Warning = require('../models/Warning');
const Payment = require('../models/Payment');
const { createNotification } = require('./notifications');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalCreators, totalInvestors, totalIdeas, pendingPayments] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'creator' }),
      User.countDocuments({ role: 'investor' }),
      Idea.countDocuments({ isActive: true }),
      Payment.countDocuments({ status: 'pending' }),
    ]);
    const recentIdeas = await Idea.find({ isActive: true })
      .populate('creator', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    const recentUsers = await User.find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ success: true, stats: { totalUsers, totalCreators, totalInvestors, totalIdeas, pendingPayments }, recentIdeas, recentUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 15 } = req.query;
    const query = { role: { $ne: 'admin' } };
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await User.findByIdAndDelete(req.params.userId);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isSuspended: true, suspendedReason: reason || 'Violated community guidelines' },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await createNotification(
      user._id, 'warning',
      'Account Suspended',
      `Your account has been suspended. Reason: ${reason || 'Violated community guidelines'}`
    );
    res.json({ success: true, message: 'User suspended', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.unsuspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isSuspended: false, suspendedReason: '' },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await createNotification(
      user._id, 'system',
      'Account Reinstated',
      'Your account has been reinstated. Welcome back!'
    );
    res.json({ success: true, message: 'User unsuspended', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.warnUser = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Warning reason is required' });
    }
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await Warning.create({ userId: user._id, issuedBy: req.user.id, reason: reason.trim() });
    user.warningCount = (user.warningCount || 0) + 1;
    const autoSuspended = user.warningCount >= 3;
    if (autoSuspended) {
      user.isSuspended = true;
      user.suspendedReason = 'Auto-suspended after 3 warnings';
    }
    await user.save();

    // Send notification to the warned user
    await createNotification(
      user._id, 'warning',
      'Warning Issued',
      `You have received a warning: ${reason.trim()}`,
      '',
      { warningCount: user.warningCount }
    );
    if (autoSuspended) {
      await createNotification(
        user._id, 'warning',
        'Account Suspended',
        'Your account has been suspended after receiving 3 warnings.'
      );
    }

    res.json({
      success: true,
      message: `Warning issued. Total warnings: ${user.warningCount}${autoSuspended ? '. User auto-suspended.' : ''}`,
      autoSuspended,
      warningCount: user.warningCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserWarnings = async (req, res) => {
  try {
    const warnings = await Warning.find({ userId: req.params.userId })
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, warnings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllWarnings = async (req, res) => {
  try {
    const warnings = await Warning.find()
      .populate('userId', 'name email warningCount')
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, warnings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllIdeas = async (req, res) => {
  try {
    const { page = 1, limit = 15, search } = req.query;
    const query = {};
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }];
    const total = await Idea.countDocuments(query);
    const ideas = await Idea.find(query)
      .populate('creator', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ success: true, ideas, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId).populate('userId');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    payment.status = 'approved';
    await payment.save();
    await User.findByIdAndUpdate(payment.userId._id, { isPremium: true });
    await createNotification(
      payment.userId._id, 'payment_approved',
      'Payment Approved!',
      'Your premium payment has been approved. Enjoy unlimited access!',
      '/browse'
    );
    res.json({ success: true, message: 'Payment approved and user upgraded to premium' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.rejectPayment = async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.paymentId).populate('userId');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    payment.status = 'rejected';
    await payment.save();
    await createNotification(
      payment.userId._id, 'payment_rejected',
      'Payment Rejected',
      `Your payment was rejected. ${reason ? 'Reason: ' + reason : 'Please contact support.'}`,
      '/investor/payment'
    );
    res.json({ success: true, message: 'Payment rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
