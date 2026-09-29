import Booking from '../models/Booking.js';
import Address from '../models/Address.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import Rating from '../models/Rating.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';

const populateBooking = (query) => query.populate('customer', 'name phone').populate('mechanic', 'name phone rating').populate('vehicle').populate('service');
const isAdmin = (req) => req.user.role === 'admin';

export async function listAddresses(req, res, next) {
  try {
    const filter = isAdmin(req) ? {} : { owner: req.user.id };
    res.json({ addresses: await Address.find(filter).sort({ createdAt: -1 }) });
  } catch (error) { next(error); }
}
export async function createAddress(req, res, next) {
  try { res.status(201).json({ address: await Address.create({ ...req.body, owner: req.user.id }) }); } catch (error) { next(error); }
}
export async function updateAddress(req, res, next) {
  try {
    const filter = isAdmin(req) ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id };
    const address = await Address.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json({ address });
  } catch (error) { next(error); }
}
export async function deleteAddress(req, res, next) {
  try {
    const filter = isAdmin(req) ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id };
    const address = await Address.findOneAndDelete(filter);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.status(204).end();
  } catch (error) { next(error); }
}

export async function listServices(_req, res, next) {
  try { res.json({ services: await Service.find({ active: true }).sort('name') }); } catch (error) { next(error); }
}
export async function listAvailableMechanics(_req, res, next) {
  try {
    const mechanics = await User.find({ role: 'mechanic', status: 'active', approved: true, available: true })
      .select('name phone avatarUrl experienceYears specializations available')
      .sort({ experienceYears: -1 });
    res.json({ mechanics });
  } catch (error) { next(error); }
}
export async function updateMechanicAvailability(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { available: req.body.available }, { new: true, runValidators: true });
    res.json({ user });
  } catch (error) { next(error); }
}
export async function createService(req, res, next) {
  try { res.status(201).json({ service: await Service.create(req.body) }); } catch (error) { next(error); }
}
export async function updateService(req, res, next) {
  try { const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!service) return res.status(404).json({ message: 'Service not found' }); res.json({ service }); } catch (error) { next(error); }
}
export async function deleteService(req, res, next) {
  try { const service = await Service.findByIdAndUpdate(req.params.id, { active: false }, { new: true }); if (!service) return res.status(404).json({ message: 'Service not found' }); res.json({ service }); } catch (error) { next(error); }
}

export async function listVehicles(req, res, next) {
  try { const filter = isAdmin(req) ? {} : { owner: req.user.id }; res.json({ vehicles: await Vehicle.find(filter).populate('owner', 'name email') }); } catch (error) { next(error); }
}
export async function createVehicle(req, res, next) {
  try { res.status(201).json({ vehicle: await Vehicle.create({ ...req.body, owner: req.user.id }) }); } catch (error) { next(error); }
}
export async function updateVehicle(req, res, next) {
  try { const filter = isAdmin(req) ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id }; const vehicle = await Vehicle.findOneAndUpdate(filter, req.body, { new: true, runValidators: true }); if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' }); res.json({ vehicle }); } catch (error) { next(error); }
}
export async function deleteVehicle(req, res, next) {
  try { const filter = isAdmin(req) ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id }; const vehicle = await Vehicle.findOneAndDelete(filter); if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' }); res.status(204).end(); } catch (error) { next(error); }
}

export async function listBookings(req, res, next) {
  try {
    const filter = isAdmin(req) ? {} : req.user.role === 'mechanic' ? { mechanic: req.user.id } : { customer: req.user.id };
    res.json({ bookings: await populateBooking(Booking.find(filter).sort({ createdAt: -1 })) });
  } catch (error) { next(error); }
}
export async function listMechanicRequests(_req, res, next) {
  try { res.json({ bookings: await populateBooking(Booking.find({ status: 'requested', mechanic: null }).sort({ createdAt: 1 })) }); } catch (error) { next(error); }
}
export async function createBooking(req, res, next) {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.body.vehicle, owner: req.user.id });
    const service = await Service.findOne({ _id: req.body.service, active: true });
    if (!vehicle || !service) return res.status(400).json({ message: 'Select one of your vehicles and an active service' });
    const booking = await Booking.create({ ...req.body, customer: req.user.id, price: service.basePrice });
    res.status(201).json({ booking: await populateBooking(Booking.findById(booking.id)) });
  } catch (error) { next(error); }
}
export async function updateBooking(req, res, next) {
  try {
    const { status } = req.body;
    let booking;
    if (req.user.role === 'mechanic' && status === 'accepted') {
      booking = await Booking.findOneAndUpdate(
        { _id: req.params.id, status: 'requested', mechanic: null },
        { mechanic: req.user.id, status },
        { new: true, runValidators: true }
      );
    } else {
      const filter = isAdmin(req) ? { _id: req.params.id } : { _id: req.params.id, mechanic: req.user.id };
      if (!isAdmin(req)) {
        const current = await Booking.findOne(filter).select('status');
        const nextStatus = { accepted: 'on_the_way', mechanic_assigned: 'on_the_way', on_the_way: 'arrived', arrived: 'service_started', service_started: 'completed' };
        if (!current || nextStatus[current.status] !== status) return res.status(409).json({ message: 'That booking status transition is not allowed' });
      }
      booking = await Booking.findOneAndUpdate(filter, { status, ...(req.body.mechanic && isAdmin(req) ? { mechanic: req.body.mechanic } : {}) }, { new: true, runValidators: true });
    }
    if (!booking) return res.status(404).json({ message: 'Booking not found, already assigned, or not assigned to you' });
    await Notification.create({ recipient: booking.customer, audience: 'user', title: 'Booking update', message: `Your booking status is now ${status.replaceAll('_', ' ')}.`, booking: booking.id });
    res.json({ booking: await populateBooking(Booking.findById(booking.id)) });
  } catch (error) { next(error); }
}

export async function listPayments(req, res, next) {
  try { const filter = isAdmin(req) ? {} : req.user.role === 'mechanic' ? { mechanic: req.user.id } : { customer: req.user.id }; res.json({ payments: await Payment.find(filter).populate('booking').sort({ createdAt: -1 }) }); } catch (error) { next(error); }
}
export async function createPayment(req, res, next) {
  try {
    const booking = await Booking.findOne({ _id: req.body.booking, customer: req.user.id, status: 'completed' });
    if (!booking) return res.status(400).json({ message: 'Payment is available only for your completed bookings' });
    const payment = await Payment.create({ booking: booking.id, customer: req.user.id, mechanic: booking.mechanic, amount: booking.price, method: req.body.method, status: 'pending' });
    res.status(201).json({ payment });
  } catch (error) { next(error); }
}
export async function updatePayment(req, res, next) {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: payment.status });
    res.json({ payment });
  } catch (error) { next(error); }
}

export async function listRatings(req, res, next) {
  try { const filter = isAdmin(req) ? {} : req.user.role === 'mechanic' ? { mechanic: req.user.id } : { customer: req.user.id }; res.json({ ratings: await Rating.find(filter).populate('customer mechanic booking', 'name').sort({ createdAt: -1 }) }); } catch (error) { next(error); }
}
export async function createRating(req, res, next) {
  try {
    const booking = await Booking.findOne({ _id: req.body.booking, customer: req.user.id, status: 'completed' });
    if (!booking || !booking.mechanic) return res.status(400).json({ message: 'Only completed bookings with an assigned mechanic can be rated' });
    res.status(201).json({ rating: await Rating.create({ ...req.body, customer: req.user.id, mechanic: booking.mechanic }) });
  } catch (error) { next(error); }
}

export async function listComplaints(req, res, next) {
  try { const filter = isAdmin(req) ? {} : req.user.role === 'mechanic' ? { mechanic: req.user.id } : { customer: req.user.id }; res.json({ complaints: await Complaint.find(filter).populate('customer mechanic booking', 'name').sort({ createdAt: -1 }) }); } catch (error) { next(error); }
}
export async function createComplaint(req, res, next) {
  try {
    const booking = await Booking.findOne({ _id: req.body.booking, customer: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(201).json({ complaint: await Complaint.create({ ...req.body, customer: req.user.id, mechanic: booking.mechanic }) });
  } catch (error) { next(error); }
}
export async function updateComplaint(req, res, next) {
  try { const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status: req.body.status, response: req.body.response }, { new: true, runValidators: true }); if (!complaint) return res.status(404).json({ message: 'Complaint not found' }); res.json({ complaint }); } catch (error) { next(error); }
}

export async function listNotifications(req, res, next) {
  try { const audience = req.user.role === 'customer' ? 'customers' : 'mechanics'; const filter = isAdmin(req) ? {} : { $or: [{ recipient: req.user.id }, { audience: 'all' }, { audience }] }; res.json({ notifications: await Notification.find(filter).sort({ createdAt: -1 }).limit(100) }); } catch (error) { next(error); }
}
export async function createNotification(req, res, next) {
  try { res.status(201).json({ notification: await Notification.create({ ...req.body, audience: req.body.audience || 'all', recipient: req.body.recipient || undefined }) }); } catch (error) { next(error); }
}
export async function markNotificationRead(req, res, next) {
  try { const notification = await Notification.findOneAndUpdate({ _id: req.params.id, $or: [{ recipient: req.user.id }, { audience: 'all' }, { audience: req.user.role === 'customer' ? 'customers' : 'mechanics' }] }, { readAt: new Date() }, { new: true }); if (!notification) return res.status(404).json({ message: 'Notification not found' }); res.json({ notification }); } catch (error) { next(error); }
}

export async function listUsers(req, res, next) {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.$or = ['name', 'email', 'phone'].map((field) => ({ [field]: { $regex: req.query.search, $options: 'i' } }));
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).limit(250);
    res.json({ users });
  } catch (error) { next(error); }
}
export async function updateUser(req, res, next) {
  try {
    const allowed = ['name', 'email', 'phone', 'address', 'city', 'status', 'approved', 'available', 'experienceYears'];
    const changes = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (changes.approved === true) changes.status = 'active';
    if (changes.approved === false) changes.status = 'pending';
    const user = await User.findByIdAndUpdate(req.params.id, changes, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) { next(error); }
}

export async function getAdminOverview(_req, res, next) {
  try {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const [customers, mechanics, admins, activeMechanics, totalBookings, successfulRevenue, statusCounts, monthlyRevenue, ratingSummary] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'mechanic' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'mechanic', status: 'active', available: true }),
      Booking.countDocuments(),
      Payment.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Payment.aggregate([
        { $match: { status: 'success', createdAt: { $gte: yearStart } } },
        { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$amount' } } },
        { $sort: { _id: 1 } }
      ]),
      Rating.aggregate([{ $group: { _id: null, average: { $avg: '$score' }, count: { $sum: 1 } } }])
    ]);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = new Map(monthlyRevenue.map((item) => [item._id, item.total]));
    res.json({
      users: { customers, mechanics, admins, total: customers + mechanics + admins },
      totalBookings,
      activeMechanics,
      revenue: successfulRevenue[0]?.total || 0,
      bookingStatuses: Object.fromEntries(statusCounts.map(({ _id, count }) => [_id, count])),
      averageRating: ratingSummary[0]?.average || 0,
      ratingCount: ratingSummary[0]?.count || 0,
      revenueByMonth: monthNames.map((month, index) => ({ month, revenue: Math.round((monthlyTotals.get(index + 1) || 0) / 1000) }))
    });
  } catch (error) { next(error); }
}
