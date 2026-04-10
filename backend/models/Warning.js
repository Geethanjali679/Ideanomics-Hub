const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Warning', warningSchema);
