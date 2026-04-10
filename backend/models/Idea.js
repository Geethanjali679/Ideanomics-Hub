const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true, maxlength: 300 },
  fullDescription: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'AI', 'Healthcare', 'Agriculture', 'Education', 'Finance', 'Other']
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  unlockCount: { type: Number, default: 0 },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

ideaSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'ideaId',
  count: true
});

ideaSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'ideaId',
  count: true
});

module.exports = mongoose.model('Idea', ideaSchema);
