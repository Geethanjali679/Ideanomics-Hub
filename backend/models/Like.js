const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

likeSchema.index({ ideaId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
