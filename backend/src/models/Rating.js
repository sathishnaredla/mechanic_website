import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, trim: true, maxlength: 1000, default: '' }
}, { timestamps: true });

export default mongoose.model('Rating', ratingSchema);