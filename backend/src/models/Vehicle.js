import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  registration: { type: String, required: true, trim: true, uppercase: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, min: 1950, max: 2100, required: true },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid', 'other'], default: 'petrol' },
  vehicleType: { type: String, required: true, trim: true, maxlength: 60 },
  color: { type: String, trim: true, default: '' }
}, { timestamps: true });

vehicleSchema.index({ owner: 1, registration: 1 }, { unique: true });
export default mongoose.model('Vehicle', vehicleSchema);