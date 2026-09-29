import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['admin', 'mechanic', 'customer'], default: 'customer' },
  address: { type: String, trim: true, maxlength: 300, default: '' },
  city: { type: String, trim: true, maxlength: 100, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'blocked', 'pending'], default: 'active' },
  approved: { type: Boolean, default: false },
  avatarUrl: { type: String, default: '' },
  experienceYears: { type: Number, min: 0, default: 0 },
  specializations: [{ type: String, trim: true }],
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  available: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};
userSchema.set('toJSON', { transform: (_doc, value) => { delete value.password; delete value.__v; return value; } });

export default mongoose.model('User', userSchema);