import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  audience: { type: String, enum: ['user', 'customers', 'mechanics', 'all'], default: 'user' },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  readAt: { type: Date, default: null },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);