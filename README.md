# Wrenchly

On-demand vehicle repair platform with customer, mechanic, and admin portals.

## Run locally

1. Install Node.js 20 or newer and MongoDB (local or Atlas).
2. Copy `backend/.env.example` to `backend/.env`, then set `MONGODB_URI` and `JWT_SECRET`.
3. In `backend`, run `npm install` then `npm run dev`.
4. In `frontend`, run `npm install` then `npm run dev`.
5. Open the Vite URL (normally http://localhost:5173).

By default the frontend runs in browser-local demo mode and makes no API requests. Demo credentials are `admin@wrenchly.demo` / `Admin@123`, `mechanic@wrenchly.demo` / `Mechanic@123`, and `customer@wrenchly.demo` / `Customer@123`. These are local preview accounts, not MongoDB users. Customer and mechanic registrations in demo mode are stored only in this browser; their passwords are hashed locally. To enable persisted API accounts, copy `frontend/.env.example` to `frontend/.env.local`, set `VITE_API_URL` to the backend URL, and restart Vite. Create the first admin by registering a user, then promote that account's `role` to `admin` in MongoDB; public registration intentionally cannot create admins.

## API

All routes are prefixed with `/api`. Authentication: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`. Domain routes: `/services`, `/mechanics`, `/vehicles`, `/addresses`, `/bookings`, `/payments`, `/ratings`, `/complaints`, `/notifications`, `/users`, and admin-only `/analytics/overview`. Protected requests use `Authorization: Bearer <token>`.

## Production notes

Configure strict CORS origins, a high-entropy JWT secret, HTTPS, and a managed MongoDB deployment. Passwords are bcrypt-hashed; validation, role checks, request rate limits, Helmet, and centralized error responses are enabled. Add email/SMS delivery, payment-provider integration, map/location services, and file storage before production use.