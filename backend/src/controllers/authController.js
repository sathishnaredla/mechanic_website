import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function issueToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address, city, experienceYears, specializations } = req.body;
    const role = req.body.role === 'mechanic' ? 'mechanic' : 'customer';
    const user = await User.create({ name, email, phone, password, address, city, role, experienceYears, specializations, approved: role === 'customer', status: role === 'mechanic' ? 'pending' : 'active' });
    res.status(201).json({ ...(role === 'customer' ? { token: issueToken(user) } : {}), user, ...(role === 'mechanic' ? { message: 'Your mechanic account is awaiting admin approval' } : {}) });
  } catch (error) { next(error); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Email or password is incorrect' });
    if (user.status === 'blocked' || user.status === 'inactive') return res.status(403).json({ message: 'This account is not active' });
    if (user.role === 'mechanic' && !user.approved) return res.status(403).json({ message: 'Your mechanic account is awaiting approval' });
    res.json({ token: issueToken(user), user });
  } catch (error) { next(error); }
}

export function me(req, res) { res.json({ user: req.user }); }