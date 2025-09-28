# Weather From Scratch (Node.js + React)

This project matches your mentor's requirements:
- React pages: Login, Weather Search, Admin
- JWT auth with roles (user/admin)
- Backend proxy to OpenWeatherMap with **5 keys** rotated (max **3 calls/hour** each)
- Search logging (username, country, city, time) in SQLite
- RESTful endpoints, validation, friendly errors

## Quick Start
1) **Backend**
```bash
cd backend
cp .env.example .env      # put 5 real OpenWeatherMap API keys
npm install
npm run seed
npm start
```
API on http://localhost:4000

2) **Frontend (new terminal)**
```bash
cd frontend
npm install
npm run dev
```
App on http://localhost:5173

### Demo Logins
- Admin: `admin` / `Admin@123`
- User:  `alice` / `User@123`

### Endpoints
- `POST /auth/login`  → sets httpOnly JWT cookie
- `POST /auth/logout`
- `GET /weather?city=Melbourne&country=AU` (auth: USER/ADMIN)
- `GET /admin/searches` (auth: ADMIN)

> In production, serve over HTTPS and set cookie `secure: true`.
