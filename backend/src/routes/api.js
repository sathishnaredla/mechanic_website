import { Router } from 'express';
import { body, param } from 'express-validator';
import { login, me, register } from '../controllers/authController.js';
import * as resources from '../controllers/resourceController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const idRule = param('id').isMongoId().withMessage('Invalid id');
const validateRequest = [validate];

router.post('/auth/register', [body('name').trim().isLength({ min: 2, max: 100 }), body('email').isEmail().normalizeEmail(), body('phone').trim().isLength({ min: 7, max: 25 }), body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/).withMessage('Use 8+ characters with uppercase, lowercase, number, and symbol'), body('role').optional().isIn(['customer', 'mechanic'])], validateRequest, register);
router.post('/auth/login', [body('email').isEmail().normalizeEmail(), body('password').notEmpty()], validateRequest, login);
router.get('/auth/me', requireAuth, me);
router.patch('/mechanics/availability', requireAuth, allowRoles('mechanic'), [body('available').isBoolean()], validateRequest, resources.updateMechanicAvailability);

router.get('/services', resources.listServices);
router.get('/mechanics', resources.listAvailableMechanics);
router.post('/services', requireAuth, allowRoles('admin'), [body('name').trim().notEmpty(), body('basePrice').isFloat({ min: 0 })], validateRequest, resources.createService);
router.patch('/services/:id', requireAuth, allowRoles('admin'), idRule, validate, resources.updateService);
router.delete('/services/:id', requireAuth, allowRoles('admin'), idRule, validate, resources.deleteService);

router.use(requireAuth);
router.get('/vehicles', resources.listVehicles);
router.post('/vehicles', allowRoles('customer', 'admin'), [body('registration').trim().notEmpty(), body('brand').trim().notEmpty(), body('model').trim().notEmpty(), body('vehicleType').trim().notEmpty().isLength({ max: 60 }), body('year').isInt({ min: 1950, max: 2100 })], validateRequest, resources.createVehicle);
router.patch('/vehicles/:id', idRule, validate, resources.updateVehicle);
router.delete('/vehicles/:id', idRule, validate, resources.deleteVehicle);
router.get('/addresses', resources.listAddresses);
router.post('/addresses', allowRoles('customer', 'admin'), [body('addressLine1').trim().notEmpty(), body('city').trim().notEmpty(), body('state').trim().notEmpty(), body('pincode').trim().notEmpty()], validateRequest, resources.createAddress);
router.patch('/addresses/:id', idRule, validate, resources.updateAddress);
router.delete('/addresses/:id', idRule, validate, resources.deleteAddress);

router.get('/bookings', resources.listBookings);
router.get('/bookings/requests', allowRoles('mechanic'), resources.listMechanicRequests);
router.post('/bookings', allowRoles('customer'), [body('vehicle').isMongoId(), body('service').isMongoId(), body('location').trim().notEmpty(), body('scheduledAt').isISO8601()], validateRequest, resources.createBooking);
router.patch('/bookings/:id/status', allowRoles('admin', 'mechanic'), [idRule, body('status').isIn(['accepted', 'mechanic_assigned', 'on_the_way', 'arrived', 'service_started', 'completed', 'cancelled'])], validateRequest, resources.updateBooking);

router.get('/payments', resources.listPayments);
router.post('/payments', allowRoles('customer'), [body('booking').isMongoId(), body('method').isIn(['upi', 'credit_card', 'debit_card', 'net_banking', 'wallet', 'cash'])], validateRequest, resources.createPayment);
router.patch('/payments/:id', allowRoles('admin'), [idRule, body('status').isIn(['pending', 'success', 'failed'])], validateRequest, resources.updatePayment);
router.get('/ratings', resources.listRatings);
router.post('/ratings', allowRoles('customer'), [body('booking').isMongoId(), body('score').isInt({ min: 1, max: 5 }), body('review').optional().isLength({ max: 1000 })], validateRequest, resources.createRating);
router.get('/complaints', resources.listComplaints);
router.post('/complaints', allowRoles('customer'), [body('booking').isMongoId(), body('type').trim().notEmpty(), body('description').trim().isLength({ min: 5, max: 2000 })], validateRequest, resources.createComplaint);
router.patch('/complaints/:id', allowRoles('admin'), [idRule, body('status').isIn(['open', 'in_progress', 'resolved', 'closed']), body('response').optional().isLength({ max: 2000 })], validateRequest, resources.updateComplaint);
router.get('/notifications', resources.listNotifications);
router.post('/notifications', allowRoles('admin'), [body('title').trim().notEmpty(), body('message').trim().notEmpty(), body('audience').optional().isIn(['all', 'customers', 'mechanics'])], validateRequest, resources.createNotification);
router.patch('/notifications/:id/read', idRule, validate, resources.markNotificationRead);
router.get('/users', allowRoles('admin'), resources.listUsers);
router.patch('/users/:id', allowRoles('admin'), [idRule, body('status').optional().isIn(['active', 'inactive', 'blocked', 'pending']), body('approved').optional().isBoolean()], validateRequest, resources.updateUser);
router.get('/analytics/overview', allowRoles('admin'), resources.getAdminOverview);

export default router;