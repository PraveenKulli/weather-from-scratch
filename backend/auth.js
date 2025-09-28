const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const db = require('./db');

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
}

function authRequired(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid/expired token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

async function handleLogin(req, res) {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const row = db.prepare('SELECT * FROM users WHERE username=?').get(username);
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: row.id, username: row.username, role: row.role });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 1000*60*60*2 });
    res.json({ message: 'Login successful', role: row.role, username: row.username });
  } catch (e) {
    if (e.issues) return res.status(400).json({ error: 'Invalid input' });
    res.status(500).json({ error: 'Server error' });
  }
}

function handleLogout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}

module.exports = { authRequired, requireRole, handleLogin, handleLogout };
