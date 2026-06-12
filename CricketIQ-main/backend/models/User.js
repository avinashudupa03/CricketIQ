import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 50 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  organization: { type: String, trim: true },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'pro' },
  role: { type: String, enum: ['analyst', 'coach', 'admin', 'viewer'], default: 'analyst' },
  reportsGenerated: { type: Number, default: 0 },
  playersTracked: { type: Number, default: 0 },
  teamsFollowed: { type: Number, default: 0 },
  matchesAnalyzed: { type: Number, default: 0 },
  twoFactorEnabled: { type: Boolean, default: false },
  emailNotifications: { type: Boolean, default: true },
  apiAccess: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
