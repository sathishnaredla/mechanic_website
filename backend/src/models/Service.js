import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  category: { type: String, trim: true, default: 'Maintenance' },
  basePrice: { type: Number, min: 0, required: true },
  durationMinutes: { type: Number, min: 1, default: 60 },
  icon: { type: String, default: 'wrench' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);