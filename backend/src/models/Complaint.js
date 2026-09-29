import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  response: { type: String, trim: true, maxlength: 2000, default: '' }
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);