const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'creator', 'investor'], default: 'investor' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },

  // Investor specific
  freeTrialUsed: { type: Boolean, default: false },
  freeTrialIdeaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', default: null },
  isPremium: { type: Boolean, default: false },
  premiumExpiry: { type: Date, default: null },
  unlockedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],

  // Account status
  isActive: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  suspendedReason: { type: String, default: '' },
  warningCount: { type: Number, default: 0 },

  // Password reset
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
