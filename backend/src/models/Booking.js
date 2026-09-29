import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  location: { type: String, required: true, trim: true, maxlength: 300 },
  scheduledAt: { type: Date, required: true },
  price: { type: Number, min: 0, required: true },
  status: { type: String, enum: ['requested', 'accepted', 'mechanic_assigned', 'on_the_way', 'arrived', 'service_started', 'completed', 'cancelled'], default: 'requested', index: true },
  paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  notes: { type: String, trim: true, maxlength: 1000, default: '' }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);