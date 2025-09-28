require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { KeyPool } = require('./keyPool');
const { authRequired, requireRole, handleLogin, handleLogout } = require('./auth');
const { getWeatherWithPool, getAllSearches } = require('./weather');

const app = express();
const PORT = process.env.PORT || 4000;

const keys = (process.env.OWM_KEYS || '').split(',').map(s => s.trim()).filter(Boolean);
if (keys.length !== 5) {
  console.warn('⚠️ Provide exactly 5 keys in OWM_KEYS. Using placeholders.');
  while (keys.length < 5) keys.push('DUMMYKEY'+keys.length);
}
const pool = new KeyPool(keys);

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 50 });
app.post('/auth/login', authLimiter, handleLogin);
app.post('/auth/logout', authRequired, handleLogout);

app.get('/weather', authRequired, (req, res) => getWeatherWithPool(pool, req, res));
app.get('/admin/searches', authRequired, requireRole('admin'), getAllSearches);

app.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ authenticated: false });
  try {
    const jwt = require('jsonwebtoken');
    const data = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true, user: { username: data.username, role: data.role } });
  } catch {
    res.json({ authenticated: false });
  }
});

app.get('/_keypool', (req, res) => res.json(pool.getSnapshot()));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => console.log(`API listening http://localhost:${PORT}`));
