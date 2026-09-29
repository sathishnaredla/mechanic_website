import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  amount: { type: Number, required: true, min: 0 },
  commission: { type: Number, min: 0, default: 0 },
  method: { type: String, enum: ['upi', 'credit_card', 'debit_card', 'net_banking', 'wallet', 'cash'], default: 'cash' },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  providerReference: { type: String, select: false }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);